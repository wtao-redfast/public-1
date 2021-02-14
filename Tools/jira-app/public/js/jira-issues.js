import {res2json, jiraSearch} from './addon'

class JiraIssues {
  async getIssue(issueKey) {
    return res2json(await AP.request(`/rest/api/3/issue/${issueKey}`));
  }

  async buildProjectTree(rootEpicKey) {
    try {
      let json = {name: rootEpicKey, children: []};
      let root = await this.getIssue(rootEpicKey);
      let epics = root.fields.issuelinks;
      for (let ii = 0; ii < epics.length; ii++) {
        let epic = epics[ii];
        let json1 = {name: epic.inwardIssue.key, children: []};
        json.children.push(json1);
        let res = await jiraSearch(
          `"Epic Link" = "${epic.inwardIssue.key}"`
        );
        let stories = res.issues;
        stories.forEach(
          story => json1.children.push({name: story.key, size: story.fields.customfield_10026})
        );
      }
      return json;
    } catch (err) {
      console.log(err);
    }
  }

  treejson2csv(json) {
    let csv = "id,value\n";
    csv += `${json.name}, \n`;
    json.children.forEach(child => {
      csv += `${json.name}.${child.name}, \n`;
      let grandChidlren = child.children;
      grandChidlren.forEach(gchild => csv += `${json.name}.${child.name}.${gchild.name}, ${gchild.size}\n`)
    });
    return csv;
  }
}

export default new JiraIssues();
