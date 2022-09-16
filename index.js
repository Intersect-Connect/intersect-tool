// import startRouter from "./router.js";
const { startRouter, goTo } = require('./router');
const { ipcRenderer } = require('electron');
// const {bootstrap} = require("bootstrap");
const { StorageManager } = require("./Utils/StorageManager");
const { TranslationManager } = require("./Utils/TranslationManager");
const { ApiManager } = require("./Utils/ApiManager");

const store = new StorageManager();
const api = new ApiManager();
const translate = new TranslationManager(store.getStorage("language"));

window.onload = () => {
    const content = document.querySelector(".content");
    const miniApp = document.getElementById("miniApp");
    const closeApp = document.getElementById("closeApp");
    const backButton = document.getElementById("backButton");
    const searchForm = document.getElementById("searchForm");
    const toastElList = document.querySelectorAll('.toast')
    const toastList = [...toastElList].map(toastEl => new bootstrap.Toast(toastEl, option))
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

    if(searchForm != null){
        searchForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            let formData = new FormData(searchForm);
            let value = formData.get("search");

            if(value != null){
                const searchUser = await api.getUser(value);
                if(searchUser.hasOwnProperty("Id")){
                    searchForm.reset();
                    return ipcRenderer.send("goTo", `account/${searchUser.Id}/`);
                }else{
                    const searchCharacter = await api.getPlayer(value);
                    if(searchCharacter.hasOwnProperty("playerData") && searchCharacter.playerData.hasOwnProperty("Id")){
                        searchForm.reset();
                        return ipcRenderer.send("goTo", `player/${searchCharacter.playerData.Id}/`);
                    }
                }
            }
        })
    }


    ipcRenderer.on("displayBackButton", () => {
        backButton.classList.remove("d-none");
    });

    ipcRenderer.on("hideBackButton", () => {
        backButton.classList.add("d-none");
    });
}