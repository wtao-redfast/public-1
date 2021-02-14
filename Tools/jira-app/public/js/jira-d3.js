import * as d3 from 'd3';

export default class JiraD3 {
  static drawRadialTidyTree(svgNode, width, csvString) {
    let svgElement = d3.select(svgNode)
      .attr('width', `${width}`)
      .attr('height', `${width}`)
      .attr('viewBox', `${-width / 2} ${-width / 2} ${width} ${width}`)
    let g = svgElement.append('g')
    let stratify = d3.stratify()
      .parentId(d => d.id.substring(0, d.id.lastIndexOf('.')));
    let tree = d3.tree()
      .size([2 * Math.PI, width / 2 - 50])
      .separation((a, b) => (a.parent == b.parent ? 1 : 2) / a.depth);
    let data = d3.csvParse(csvString);
    let root = tree(stratify(data));

    let link = g.selectAll('.link')
      .data(root.links())
      .enter().append('path')
        .attr('class', 'link')
        .attr('d', d3.linkRadial()
          .angle(d => d.x)
          .radius(d => d.y));
    let radialPoint = (x, y) => [(y = +y) * Math.cos(x -= Math.PI / 2), y * Math.sin(x)];
    let node = g.selectAll('.node')
      .data(root.descendants())
      .enter().append('g')
        .attr('class', d => 'node' + (d.children ? ' node--internal' : ' node--leaf'))
        .attr('transform', d => 'translate(' + radialPoint(d.x, d.y) + ')')
      .on("click", (evt, d) => console.log(d));
    node.append('circle')
      .attr('r', 2.5);
    node.append('text')
      .attr('dy', '0.31em')
      .attr('x', d => d.x < Math.PI === !d.children ? 6 : -6)
      .attr('text-anchor', d => d.x < Math.PI === !d.children ? 'start' : 'end')
      .attr('transform', d => 'rotate(' + (d.x < Math.PI ? d.x - Math.PI / 2 : d.x + Math.PI / 2) * 180 / Math.PI + ')')
      .text(d => d.id.substring(d.id.lastIndexOf('.') + 1));
  }

  static drawZoomableSunburst(svgNode, data, width) {
    const svg = d3.select(svgNode)
      .attr('width', `${width}`)
      .attr('height', `${width}`)
      .attr('viewBox', `${-width / 2} ${-width / 2} ${width} ${width}`)
      .on('click', () => focusOn()); // Reset zoom on canvas click

    let root = d3.hierarchy(data)
      .sum(d => d.size);
    const partition = d3.partition();
    const slice = svg.selectAll('g.slice')
      .data(partition(root).descendants());
    slice.exit().remove();

    const newSlice = slice.enter()
      .append("g")
        .attr("class", "slice")
      .on("click", (evt, d) => {
        evt.stopPropagation();
        focusOn(d);
      });
    const formatNumber = d3.format(',d');
    newSlice.append('title')
      .text(d => d.data.name + '\n' + formatNumber(d.value));

    const x = d3.scaleLinear()
      .range([0, 2 * Math.PI])
      .clamp(true);
    const maxRadius = width / 2;
    const y = d3.scaleSqrt()
      .range([maxRadius*.1, maxRadius]);
    const arc = d3.arc()
      .startAngle(d => x(d.x0))
      .endAngle(d => x(d.x1))
      .innerRadius(d => Math.max(0, y(d.y0)))
      .outerRadius(d => Math.max(0, y(d.y1)));
    let color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, data.children.length + 1));
    newSlice
      .append("path")
      .attr("class", "main-arc")
      .style("fill", (d) => color((d.children ? d : d.parent).data.name))
      .attr("d", arc);

    const middleArcLine = d => {
        const halfPi = Math.PI/2;
        const angles = [x(d.x0) - halfPi, x(d.x1) - halfPi];
        const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);

        const middleAngle = (angles[1] + angles[0]) / 2;
        const invertDirection = middleAngle > 0 && middleAngle < Math.PI; // On lower quadrants write text ccw
        if (invertDirection) { angles.reverse(); }

        const path = d3.path();
        path.arc(0, 0, r, angles[0], angles[1], invertDirection);
        return path.toString();
    };
    newSlice.append('path')
      .attr('class', 'hidden-arc')
      .attr('id', (_, i) => `hiddenArc${i}`)
      .attr('d', middleArcLine);

    const textFits = d => {
      const CHAR_SPACE = 6;
      const deltaAngle = x(d.x1) - x(d.x0);
      const r = Math.max(0, (y(d.y0) + y(d.y1)) / 2);
      const perimeter = r * deltaAngle;
      return d.data.name.length * CHAR_SPACE < perimeter;
    };
    const text = newSlice.append('text')
      .attr('display', d => textFits(d) ? null : 'none');
    text.append('textPath')
      .attr('startOffset','50%')
      .attr('xlink:href', (_, i) => `#hiddenArc${i}` )
      .text(d => d.data.name);

    function focusOn(d = { x0: 0, x1: 1, y0: 0, y1: 1 }) {
      const transition = svg.transition()
        .duration(750)
        .tween('scale', () => {
            const xd = d3.interpolate(x.domain(), [d.x0, d.x1]), 
              yd = d3.interpolate(y.domain(), [d.y0, 1]);
            return t => { x.domain(xd(t)); y.domain(yd(t)); };
        });

      transition.selectAll('path.main-arc')
        .attrTween('d', d => () => arc(d));
      transition.selectAll('path.hidden-arc')
        .attrTween('d', d => () => middleArcLine(d));
      transition.selectAll('text')
        .attrTween('display', d => () => textFits(d) ? null : 'none');
      
      moveStackToFront(d);
      function moveStackToFront(elD) {
        svg.selectAll('.slice')
          .filter(d => d === elD)
          .each(function(d) {
            this.parentNode.appendChild(this);
            if (d.parent) { moveStackToFront(d.parent); }
          });
      }
    }
  }

  static drawRangePlot(svgNode, data, width, height) {
    const svg = d3.select(svgNode)
      .attr('width', `${width}`)
      .attr('height', `${height}`)
      .attr('viewBox', `0 0 ${width} ${height}`);
    var issues = [['SAN-1', 0,4], ['SAN-12',2,6], ['SAN-14', 1,4], ['SAN-5', 3,7], ['SAN-8', 2,4], ['SAN-3', 6, 7], ['SAN-18', 1, 8]];
    var dates = ['09/01', '09/02', '09/03', '09/04', '09/05', '09/06', '09/07', '09/08', '09/09'];

    var margin = 40, labelMargin = 100;
    var barHeight = 20;
    var colWidth = (width - labelMargin - 2 * margin) / dates.length;
    var rowHeight = (height - 2 * margin) / issues.length;

    var xscale = d3.scaleLinear()
      .domain([0, dates.length])
      .range([0, colWidth * dates.length]);
    var yscale = d3.scaleLinear()
      .domain([0, issues.length])
      .range([0, rowHeight * issues.length]);
    svg.append('g')
      .attr('id', 'vbar')
      .attr('transform', `translate(${labelMargin + margin}, 0)`)
      .selectAll('line')
      .data(dates)
      .enter()
        .append('line')
          .attr('x1', (_, i) => i * colWidth)
          .attr('y1', 0)
          .attr('x2', (_, i) => i * colWidth)
          .attr('y2', (issues.length + 1) * rowHeight)
          .style('stroke', '#adadad')
          .style('stroke-width', '1px')
          .style('stroke-dasharray', '3, 3');
    svg.append('g')
      .attr('transform', `translate(${labelMargin + margin}, 0)`)
      .selectAll('text')
      .data(dates)
      .enter()
        .append('text')
        .attr('x', (_, i) => i * colWidth)
        .attr('y', (issues.length + 1) * rowHeight)
        .style('font-size', 14)
        .style('text-anchor', 'middle')
        .style('alignment-baseline', 'center')
        .text(d => d);

    svg.append('g')
      .attr('id', 'hbar')
      .attr('transform', `translate(${labelMargin}, ${margin})`)
      .selectAll('line')
      .data(issues)
      .enter()
        .append('line')
          .attr('x1', 0)
          .attr('y1', (_, i) => i * rowHeight)
          .attr('x2', dates.length * colWidth + margin)
          .attr('y2', (_, i) => i * rowHeight)
          .style('stroke', '#adadad')
          .style('stroke-width', '1px')
          .style('stroke-dasharray', '3, 3')
    svg.append('g')
      .attr('transform', `translate(${labelMargin}, ${margin})`)
      .selectAll('text')
      .data(issues)
      .enter()
        .append('text')
        .attr('x', -10)
        .attr('y', (_, i) => i * rowHeight + 5)
        .style('font-size', 14)
        .style('text-anchor', 'end')
        .style('alignment-baseline', 'center')
        .text(d => d[0]);

    svg.append('g')
      .attr('transform', `translate(${labelMargin + margin}, ${margin})`)
      .attr('id', 'bars')
      .selectAll('rect')
      .data(issues)
      .enter()
        .append('rect')
          .attr('height', barHeight)
          .attr('x', d => xscale(d[1]))
          .attr('y', (_, i) => yscale(i) - barHeight / 2)
          .style('fill', '#00187B')
          .attr('width', 0);
    svg.selectAll('rect')
      .data(issues)
      .transition()
      .duration(1000)
      .attr('width', d => xscale(d[2]) - xscale(d[1]));
  }
}