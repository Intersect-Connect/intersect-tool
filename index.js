// import startRouter from "./router.js";
const { startRouter, goTo } = require('./router');
const { ipcRenderer } = require('electron');
const { StorageManager } = require("./Utils/StorageManager");
const { TranslationManager } = require("./Utils/TranslationManager");
const store = new StorageManager();
const translate = new TranslationManager(store.getStorage("language"));

window.onload = () => {
    const content = document.querySelector(".content");
    const miniApp = document.getElementById("miniApp");
    const closeApp = document.getElementById("closeApp");
    const backButton = document.getElementById("backButton");
    let checkInterval = null;

    startRouter(content);

    if (miniApp != null) {
        miniApp.addEventListener("click", () => {
            ipcRenderer.send("reduce_app")
        })
    }

    if (closeApp != null) {
        closeApp.addEventListener("click", () => {
            ipcRenderer.send("quit_app")
        })
    }

    if (backButton != null) {
        backButton.addEventListener("click", () => {
            goTo(localStorage.getItem("lastPage"));
        });
    }


    ipcRenderer.on("displayBackButton", () => {
        backButton.classList.remove("d-none");
    });

    ipcRenderer.on("hideBackButton", () => {
        backButton.classList.add("d-none");
    });
}