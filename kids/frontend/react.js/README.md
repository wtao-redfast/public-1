React.js app will be deployed to https://wtao-nexus5.github.io/public/ (ref: https://www.youtube.com/watch?v=N63C0mkFDFw)

Details:
1. Uses the github pages for pulishing the react.js app
2. Use gh-pages CLI as a script action in package.json for deployment
    ```
    "scripts": {
        "deploy": "gh-pages -d build"
    }
    ```
3. Generate github **account specific** personal access token `Settings|Developer settings|Personal access token`
4. Create github **repo specific** secrets at `Settings|Secrets` with username, email and personal access token
5. In github CI/CD
    1. Build the react.js app first to /build folder
    2. Setup git config (username and email)and grant github access (with personal access token) by usign secrets
    3. Run `npm run deploy`
    4. App will be available at `https://[account name].github.io/[repo name]/`

