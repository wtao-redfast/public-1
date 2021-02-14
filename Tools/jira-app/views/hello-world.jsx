import "regenerator-runtime/runtime.js";
import React, { useEffect, useRef } from 'react';
import JiraIssues from '../public/js/jira-issues'; 
import JiraD3 from '../public/js/jira-d3';
import JiraSprint from '../public/js/jira-sprint';

export default function HelloWorld() {
  const refRadialTree = useRef();
  const refSunburst = useRef();
  const refSprint1 = useRef();

  useEffect(() => {
    // You can't use in the function HelloWorld directly. It will return AP not defined
    // The reason is,
    // 1. it is server side rendering of react
    // 2. AP is from a <script .....all.js> node in index.html
    // 3. when it is rendered at server side, the  <script> isn't downloaded, hence the undefine
    // 4. useEffect executes at client side runtime, hence the AP are valid at this time.
    const fetchData = async () => {
      let data = await JiraIssues.buildProjectTree('SAN-23');
      let csvString = JiraIssues.treejson2csv(data);
      JiraD3.drawRadialTidyTree(refRadialTree.current, 500, csvString);
      JiraD3.drawZoomableSunburst(refSunburst.current, data, 500);

      let sprint = new JiraSprint(2);
      //await sprint.init();
      //let issues = sprint.exportDailyActivity();
      JiraD3.drawRangePlot(refSprint1.current, {}, 720, 360);
    };
    fetchData();
  });

  return <div >
    <div><svg ref={refRadialTree}/> </div>
    <div><svg ref={refSunburst}/> </div>
    <div><svg ref={refSprint1}/> </div>
  </div>
}
