const { ipcRenderer } = require("electron");
const Dialogs = require("dialogs");

ipcRenderer.on("asynchronous-message", (evt, message) => {
    if (message.menu == "display") {
        let panel = document.querySelector("#panel");
        if (panel.style.visibility == "hidden") {
            panel.style.width = "200px";
            panel.style.visibility = "visible";
        } else {
            panel.style.width = 0;
            panel.style.visibility = "hidden";
        }
    } else if (message.menu == "website") {
        const dialogs = Dialogs();
        dialogs.prompt("Please enter your website url", url => {
            let iframe = document.querySelector("#iframe");
            iframe.src = "https://" + url;
        });
    }
});
