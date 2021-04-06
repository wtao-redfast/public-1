import React, { useEffect, useRef } from 'react';
import { PanelProps, PanelData } from '@grafana/data';
import { SimpleOptions } from 'types';
import { css, cx } from 'emotion';
import { stylesFactory, useTheme } from '@grafana/ui';
import * as d3 from 'd3';
import $ from 'jquery';
/*eslint no-restricted-imports: [0]*/
import moment from 'moment';

interface Props extends PanelProps<SimpleOptions> {}

class TimedBarsItem {
  datetime: String = 'n/a';
  total_tickets = 0;
  total_storypoints = 0;
  completed_tickets = 0;
  completed_storypoints = 0;
}

const colorPalette = [
  '#659954',
  '#D19E2A',
  '#59B7C7',
  '#D6672C',
  '#cddc49',
  '#cb7e94',
  '#e94b30',
  '#fee659',
  '#a1cfdd',
  '#33cee1',
  '#98ffc3',
  '#a3abd0',
];

export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
  const refPanel = useRef();
  const refD3 = useRef();
  const refTooltip = useRef();
  // @ts-ignore:
  const theme = useTheme();
  const styles = getStyles();
  const animation = 100;

  const extractBarNames = (data: PanelData) => data.series.map((s) => s.name);
  const extractTimeSeries = (data: PanelData) => {
    let timeSeries: number[] = [];
    if (data.series.length > 0 && data.series[0].fields.length > 0) {
      let timeField = data.series[0].fields.filter((item) => item.name === 'Time');
      if (timeField.length === 1) {
        timeSeries = timeField[0].values.toArray();
      }
    }
    if (timeSeries.length > 1) {
      if (timeSeries[timeSeries.length - 1] - timeSeries[0] > 24 * 60 * 60 * 1000) {
        return timeSeries.map((ts) => moment.utc(ts).format('M/D'));
      } else {
        return timeSeries.map((ts) => moment.utc(ts).format('H:mm:ss'));
      }
    }
    return timeSeries.map((ts) => moment.utc(ts).format('M/D'));
  };
  const extractTimeValuesSeries = (data: PanelData) => {
    let timeSeries = extractTimeSeries(data);
    let barNames = extractBarNames(data);
    return timeSeries.map((time, ii) => {
      let item = new TimedBarsItem();
      item.datetime = time;
      barNames.forEach((_, jj) => {
        let valueField = data.series[jj].fields.filter((item) => item.name === 'Value');
        if (valueField.length === 1) {
          // @ts-ignore:
          item[barNames[jj]] = valueField[0].values.buffer[ii] as number;
        }
      });
      return item;
    });
  };
  let barNames = extractBarNames(data);
  let timeSeries = extractTimeSeries(data);
  let timedValuesSeries = extractTimeValuesSeries(data);
  let barColors = colorPalette.slice(0, barNames.length);

  useEffect(() => {
    // @ts-ignore:
    refD3.current.innerHTML = '';
    // @ts-ignore:
    let tooltip = d3.select(refTooltip.current).style('opacity', 0);

    // @ts-ignore:
    let svg = d3
      .select(refD3.current)
      .attr('width', width)
      .attr('height', height - 30)
      .append('g')
      .attr('transform', 'translate(' + 30 + ',' + 10 + ')');

    let axisHeight = height - 30 - 35;
    let x = d3
      .scaleBand()
      .domain(timeSeries)
      .range([0, width])
      // @ts-ignore:
      .padding([0.2]);
    svg
      .append('g')
      .style('font-size', 12)
      .attr('transform', 'translate(0,' + axisHeight + ')')
      // adjust axis bar, tick lines, and tick text position; name of 'selector'/'attr' are inspected from browser
      .call(d3.axisBottom(x).tickSize(0))
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick text').attr('y', '6'));
    let y = d3.scaleLinear().domain([0, 80]).range([axisHeight, 0]);
    svg
      .append('g')
      .style('font-size', 12)
      // adjust tick to have 4 steps and be a line strike through the chart
      .call(d3.axisRight(y).tickSize(width).tickValues(d3.range(0, 100, 20)))
      .call((g) => g.select('.domain').remove())
      .call((g) => g.selectAll('.tick line').attr('stroke-opacity', 0.5))
      .call((g) => g.selectAll('.tick text').attr('x', '-20px'));
    let xBars = d3
      .scaleBand()
      // @ts-ignore:
      .domain(barNames)
      .range([0, x.bandwidth()])
      // @ts-ignore:
      .padding([0.05]);
    let color = d3
      .scaleOrdinal()
      // @ts-ignore:
      .domain(barNames)
      .range(barColors.map((c) => c + 'A0'));

    // @ts-ignore:
    svg
      .append('g')
      .selectAll('g')
      .data(timedValuesSeries)
      .join('g')
      // @ts-ignore:
      .attr('transform', (d) => 'translate(' + x(d.datetime) + ', 0)')
      .selectAll('rect')
      // @ts-ignore:
      .data((row) => barNames.map((name) => ({ key: name, value: row[name] })))
      .join('rect')
      // @ts-ignore:
      .attr('x', (d) => xBars(d.key))
      // @ts-ignore:
      .attr('y', (d) => y(d.value))
      .attr('width', xBars.bandwidth())
      // @ts-ignore:
      .attr('height', (d) => axisHeight - y(d.value))
      // @ts-ignore:
      .attr('fill', (d) => color(d.key))
      .on('mousemove', (d) => {
        // get panel's position relative to the entire document (only jquery can do it neatly)
        let offset = $(refPanel.current).offset();
        // get current mouse position from d3, then offset it.
        tooltip
          .html(d.key + '<BR/>' + d.value)
          // @ts-ignore:
          .style('left', d3.event.pageX - offset.left + 10 + 'px')
          // @ts-ignore:
          .style('top', d3.event.pageY - offset.top + 10 + 'px');
        tooltip.transition().duration(animation).style('opacity', 1);
      })
      .on('mouseout', (_) => tooltip.transition().duration(animation).style('opacity', 0));
  });

  return (
    <div
      ref={refPanel}
      className={cx(
        styles.wrapper,
        css`
          width: ${width}px;
          height: ${height}px;
        `
      )}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* @ts-ignore */}
      <svg ref={refD3} />
      {/* @ts-ignore */}
      <div className={cx(styles.legend)}>
        {barNames.map((name, index) => {
          return (
            <div key={{ index }} style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ width: '14px', height: '3px', backgroundColor: barColors[index], marginRight: '6px' }} />
              {/* @ts-ignore */}
              <span style={{ marginRight: '15px', fontSize: '12px' }}>{name}</span>
            </div>
          );
        })}
      </div>
      {/* @ts-ignore */}
      <div ref={refTooltip} className={cx(styles.tooltip)} />
    </div>
  );
};

const getStyles = stylesFactory(() => {
  return {
    wrapper: css`
      position: relative;
    `,
    legend: css`
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      height: 30px;
      margin-top: 10px;
    `,
    tooltip: css`
      position: absolute;
      text-align: center;
      width: auto;
      height: auto;
      padding: 12px;
      border: 1px;
      top: 100px;
      left: 100px;
      background: #111111;
      border-radius: 3px;
      pointer-events: none;
      z-index: 1000;
    `,
  };
});
