1. Sandbox jira cloud at https://redfastlabs.atlassian.net/secure/BrowseProjects.jspa
2. APi token is created at https://id.atlassian.com/manage-profile/security/api-tokens. Saved in credentials.json
3. Run `yarn start` to auto register and serve the cloud app
4. Default view is using Handlebars. If switch to react.js, run `yarn build` to compile the jsx files first

* Note
1. The UI is using server side rendering (SSR). Hence special handling on using data from <script> tag in index.html
2. Need to add the regenerator-runtime package for using async/await in SSR.
3. Jira has two sets of APIs, https://developer.atlassian.com/cloud/jira/software/rest/intro/, https://developer.atlassian.com/cloud/jira/platform/rest/v3/intro/