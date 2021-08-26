const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");

let createWindow = () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });
    win.webContents.openDevTools();
    win.loadFile("index.html");
    return win;
};

app.on("activate", function () {});

app.on("ready", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        let win = createWindow();
        const menu = Menu.buildFromTemplate([
            {
                label: "Electron",
                submenu: [
                    {
                        label: "Load URL...",
                        click: () => {
                            win.webContents.send("asynchronous-message", {
                                menu: "website",
                            });
                        },
                    },
                    {
                        label: "Show/hide web plugin tool",
                        click: () =>
                            win.webContents.send("asynchronous-message", {
                                menu: "display",
                            }),
                    },
                    { label: "Exit" },
                ],
            },
        ]);
        Menu.setApplicationMenu(menu);
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
