export function res2json(res) {
  return JSON.parse(res.body);
}

export async function jiraSearch(jqls) {
  return res2json(
    await AP.request(`/rest/api/3/search?jql=${jqls}`)
  );
}