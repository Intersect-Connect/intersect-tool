const Navigo = require('navigo');
const ejs = require('ejs');
const { TranslationManager } = require("./Utils/TranslationManager");
const { StorageManager } = require("./Utils/StorageManager");
const { ApiManager } = require("./Utils/ApiManager");
const { ElementManager } = require("./Utils/ElementManager");
const crypto = require('crypto');

const store = new StorageManager();
const translate = new TranslationManager();
const element = new ElementManager();
const api = new ApiManager();

const { renderInstall } = require('./pages/install/install.js');
const { renderGetToken } = require('./pages/getToken/getToken.js');
const { renderAccount } = require('./pages/account/account.js');
const { renderAccounts } = require('./pages/accounts/accounts.js');
const { renderGuilds } = require('./pages/guilds/guilds.js');
const { renderVariables } = require('./pages/variables/variables.js');
const { renderGuildMembers } = require('./pages/guild_members/guild_members.js');
const { renderGuildVariables } = require('./pages/guild_variables/guild_variables.js');
const { renderOffline } = require('./pages/offline/offline.js');
const { renderAccountLog } = require('./pages/accountLog/accountLog.js');
const { renderMain } = require('./pages/main/main.js');
const { renderPlayerList } = require('./pages/players/players.js');
const { renderPlayer } = require('./pages/player/player.js');
const { renderAbout } = require('./pages/about/about.js');
const { renderUser } = require('./pages/user/user.js');
const { renderLogin } = require('./pages/login/login.js');
const { renderUsers } = require('./pages/users/users.js');
const { renderUpdate } = require('./pages/update/index.js');
const { renderSettings } = require('./pages/settings/settings.js');
const { ipcRenderer } = require('electron');

const router = new Navigo('/', { hash: true });

function startRouter(content) {

    if (router.getCurrentLocation().hashString == "") {
        if (!store.storageExist("server_url") && !store.storageExist("accountUsername") && !store.storageExist("accountPassword")) {
            if (!store.storageExist("pageSetting")) {
                store.setStorage("pageSetting", 25);
            }
            document.getElementById("mainNav").classList.add("d-none");
            router.navigate("/install");
        } else {
            if (!store.storageExist("accountId")) {
                document.getElementById("mainNav").classList.add("d-none");
                router.navigate("/login");
            } else {
                document.getElementById("mainNav").classList.remove("d-none");
                if (!store.storageExist("pageSetting")) {
                    store.setStorage("pageSetting", 25);
                }
                router.navigate("/");
            }
        }
    }
    try {
        router
            .on({
                "/": async () => {
                    // call updatePageLinks to let navigo handle the links
                    // when new links have been inserted into the dom
                    const getOnlineList = await api.getOnlineList();
                    const getServerStat = await api.serverStat();
                    let playerList = [];
                    let serverStat = [];

                    if (getOnlineList && getOnlineList.hasOwnProperty("entries")) {
                        playerList = getOnlineList.entries;
                    }

                    if (getServerStat && getServerStat.hasOwnProperty("onlineCount")) {
                        serverStat = getServerStat;
                    }

                    renderMain(ejs, content, translate, api, playerList, getServerStat).then(router.updatePageLinks);
                },
                install: () => {
                    renderInstall(content, translate, store, ipcRenderer, crypto, api).then(router.updatePageLinks);
                },
                getToken: () => {
                    renderGetToken(content, translate, store, ipcRenderer, crypto, api).then(router.updatePageLinks);
                },
                players: async () => {
                    const requestGetPlayersList = await api.getPlayersList();
                    const pages = Math.round(requestGetPlayersList.Total / requestGetPlayersList.PageSize);
                    let players = null;
                    if (requestGetPlayersList) {
                        players = requestGetPlayersList.Values;
                    } else {
                        players = [];
                    }
                    renderPlayerList(ejs, content, translate, api, ipcRenderer, players, pages).then(router.updatePageLinks);
                },
                "players/pages/:page": async ({ data, params }) => {
                    const requestGetPlayersList = await api.getPlayersList(data.page);
                    const pages = Math.round(requestGetPlayersList.Total / requestGetPlayersList.PageSize);
                    let players = null;
                    if (requestGetPlayersList) {
                        players = requestGetPlayersList.Values;
                    } else {
                        players = [];
                    }
                    renderPlayerList(ejs, content, translate, api, ipcRenderer, players, pages).then(router.updatePageLinks);
                },
                "player/:username/": async ({ data, params }) => {
                    const characterData = await api.getPlayer(data.username);
                    const userData = await api.getUser(characterData.playerData.UserId);
                    renderPlayer(ejs, content, translate, api, element, characterData, userData).then(router.updatePageLinks);
                },
                accounts: async () => {
                    const requestUsersList = await api.getUsersList();
                    const pages = Math.round(requestUsersList.Total / requestUsersList.PageSize);
                    let users = null;
                    if (requestUsersList !== null || requestUsersList != undefined && requestUsersList.hasOwnProperty("Values")) {
                        users = requestUsersList.Values;
                    } else {
                        users = [];
                    }
                    renderAccounts(ejs, content, translate, api, users, pages).then(router.updatePageLinks);
                },
                "accounts/pages/:page": async ({ data, params }) => {
                    const requestUsersList = await api.getUsersList(data.page);
                    const pages = Math.round(requestUsersList.Total / requestUsersList.PageSize);
                    let users = null;
                    if (requestUsersList !== null || requestUsersList != undefined && requestUsersList.hasOwnProperty("Values")) {
                        users = requestUsersList.Values;
                    } else {
                        users = [];
                    }
                    renderAccounts(ejs, content, translate, api, users, pages).then(router.updatePageLinks);
                },
                "account/:id/": async ({ data, params }) => {
                    const userData = await api.getUser(data.id);
                    const charactersData = await api.getUserCharacters(data.id);

                    renderAccount(ejs, content, translate, { user: userData, characters: charactersData }).then(router.updatePageLinks);
                },
                "account/:id/logs/pages/:page": async ({ data, params }) => {
                    const userLog = await api.getUserLogs(data.id, data.page);
                    const pages = Math.round(userLog.Total / userLog.PageSize);
                    const logs = userLog.Values;

                    renderAccountLog(ejs, content, translate, ipcRenderer, logs, pages).then(router.updatePageLinks);
                },
                guilds: async () => {
                    const requestGuildsList = await api.getGuildsList();
                    const pages = Math.round(requestGuildsList.Total / requestGuildsList.PageSize);
                    let guilds = null;
                    if (requestGuildsList !== null || requestGuildsList != undefined && requestGuildsList.hasOwnProperty("Values")) {
                        guilds = requestGuildsList.Values;
                    } else {
                        guilds = [];
                    }
                    renderGuilds(ejs, content, translate, api, ipcRenderer, guilds, pages).then(router.updatePageLinks);
                },
                "guilds/pages/:page": async ({ data, params }) => {
                    const requestGuildsList = await api.getGuildsList(data.page);
                    const pages = Math.round(requestGuildsList.Total / requestGuildsList.PageSize);
                    let guilds = null;
                    if (requestGuildsList !== null || requestGuildsList != undefined && requestGuildsList.hasOwnProperty("Values")) {
                        guilds = requestGuildsList.Values;
                    } else {
                        guilds = [];
                    }
                    renderGuilds(ejs, content, translate, api, ipcRenderer, guilds, pages).then(router.updatePageLinks);
                },
                "guild/:id/pages/:page": async ({ data, params }) => {
                    const requestGuild = await api.getGuild(data.id, data.page);
                    renderGuildMembers(ejs, content, translate, api, ipcRenderer, element, requestGuild).then(router.updatePageLinks);
                },
                "guild/variables/:id": async ({ data, params }) => {
                    const requestGuild = await api.getGuild(data.id);
                    renderGuildVariables(ejs, content, translate, api, ipcRenderer, element, requestGuild).then(router.updatePageLinks);
                },
                variables: async () => {
                    const requestVariables = await api.getServerVariables(0);
                    const pages = Math.round(requestVariables.Total / requestVariables.PageSize);
                    renderVariables(ejs, content, translate, api, ipcRenderer, element, requestVariables, pages).then(router.updatePageLinks);
                },
                "variables/pages/:page": async ({ data, params }) => {
                    const requestVariables = await api.getServerVariables(data.page);
                    const pages = Math.round(requestVariables.total / requestVariables.count);
                    renderVariables(ejs, content, translate, api, ipcRenderer, element, requestVariables, pages).then(router.updatePageLinks);
                },
                about: () => {
                    renderAbout(content, translate).then(router.updatePageLinks);
                },
                update: () => {
                    renderUpdate(content, ipcRenderer, element, translate).then(router.updatePageLinks);
                },
                offline: () => {
                    renderOffline(content, ipcRenderer, element, translate).then(router.updatePageLinks);
                },
                settings: () => {
                    content.innerHTML = "";
                    renderSettings(content, ipcRenderer, translate, store).then(router.updatePageLinks);
                },
                login: () => {
                    renderLogin(content, translate, store, ipcRenderer, crypto, api).then(router.updatePageLinks);;
                },
                users: () => {
                    renderUsers(content).then(router.updatePageLinks);
                },
                "/user/:id/": ({ data, params }) => {
                    renderUser(content, data.id);
                },
            })
            .notFound(() => {
                console.log("Error not found")
            })
            .resolve();
    } catch (error) {
        console.log(error)
    }

}

function goTo(route) {
    console.log("Route", route);
    console.log(router)
    return router.navigate(route);
}

ipcRenderer.on("goTo", (event, arg) => {
    goTo(arg);
})

exports.startRouter = startRouter;
exports.goTo = goTo;