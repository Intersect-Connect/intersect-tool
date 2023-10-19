const os = require("os");
const http = require("http");
const Navigo = require('navigo');
const ejs = require('ejs');
const shell = require('electron').shell;
const MatomoTracker = require('matomo-tracker');
const { TranslationManager } = require("./Utils/TranslationManager");
const { StorageManager } = require("./Utils/StorageManager");
const { ApiManager } = require("./Utils/ApiManager");
const { ElementManager } = require("./Utils/ElementManager");
const crypto = require('crypto');

const store = new StorageManager();
const translate = new TranslationManager();
const element = new ElementManager();

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
const { renderRank } = require('./pages/rank/rank.js');
const { renderPlayer } = require('./pages/player/player.js');
const { renderAbout } = require('./pages/about/about.js');
const { renderSupport } = require('./pages/support/support.js');
const { renderUser } = require('./pages/user/user.js');
const { renderLogin } = require('./pages/login/login.js');
const { renderUsers } = require('./pages/users/users.js');
const { renderUpdate } = require('./pages/update/index.js');
const { Settings } = require('./pages/settings/settings.js');
const { ipcRenderer } = require('electron');

const router = new Navigo('/', { hash: true });
const matomo = new MatomoTracker(12, 'https://analytics.thomasfds.fr/matomo.php');

const libs = {
    "matomo": matomo,
    "translate": translate,
    "api": new ApiManager(),
    "store": store,
    "ipcRenderer": ipcRenderer,
}


async function startRouter(content) {
    const api = new ApiManager();
    await api.checkLogin();

    console.log("Computer Name", os.hostname())
    console.log(os.networkInterfaces())

    if (router.getCurrentLocation().hashString == "") {
        if (!store.storageExist("server_url") && !store.storageExist("accountUsername") && !store.storageExist("accountPassword")) {
            if (!store.storageExist("pageSetting")) {
                store.setStorage("pageSetting", 25);
            }
            if (document.getElementById("mainNav") && document.getElementById("mainNav")) {
                document.getElementById("mainNav").classList.add("d-none");
                document.getElementById("searchNav").classList.add("d-none");
            }
            router.navigate("/install");
        } else {
            if (!store.storageExist("accountId")) {
                if (document.getElementById("mainNav") && document.getElementById("mainNav")) {
                    document.getElementById("mainNav").classList.add("d-none");
                    document.getElementById("searchNav").classList.add("d-none");
                }
                router.navigate("/login");
            } else {
                if (document.getElementById("mainNav") && document.getElementById("mainNav")) {
                    document.getElementById("mainNav").classList.remove("d-none");
                    document.getElementById("searchNav").classList.remove("d-none");
                }
                if (!store.storageExist("pageSetting")) {
                    store.setStorage("pageSetting", 25);
                }
                if (store.storageExist("api_token")) {
                    const reloadTokenRequest = await api.reloadToken();
                    console.log("reloadTokenRequest", reloadTokenRequest)
                    if (reloadTokenRequest) {
                        router.navigate("/");

                    } else {
                        router.navigate("/offline");
                    }
                }
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

                    if (
                        getOnlineList != undefined && getOnlineList.hasOwnProperty("entries") &&
                        getServerStat != undefined && getServerStat.hasOwnProperty("onlineCount")
                    ) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }

                        playerList = getOnlineList.entries;
                        serverStat = getServerStat;

                        const controllerData = {
                            "playerList": playerList,
                            "serverStat": serverStat
                        }
                        // matomoStat('it://index');
                        // await matomoStatWithDelay('it://index');
                        renderMain(ejs, content, libs, controllerData).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }
                },
                install: () => {
                    renderInstall(content, translate, store, ipcRenderer, crypto, api).then(router.updatePageLinks);
                },
                getToken: () => {
                    renderGetToken(content, translate, store, ipcRenderer, crypto, api).then(router.updatePageLinks);
                },
                players: async () => {
                    const requestGetPlayersList = await api.getPlayersList();

                    if (requestGetPlayersList != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestGetPlayersList.Total / requestGetPlayersList.PageSize);
                        let players = null;
                        if (requestGetPlayersList) {
                            players = requestGetPlayersList.Values;
                        } else {
                            players = [];
                        }
                        const controllerData = {
                            "players": players,
                            "page": pages
                        }
                        // matomoStat('it://playersList');
                        // await matomoStatWithDelay('it://playersList');

                        renderPlayerList(ejs, content, libs, controllerData).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }

                },
                "players/pages/:page": async ({ data, params }) => {
                    const requestGetPlayersList = await api.getPlayersList(data.page);
                    if (requestGetPlayersList != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestGetPlayersList.Total / requestGetPlayersList.PageSize);
                        let players = null;
                        if (requestGetPlayersList) {
                            players = requestGetPlayersList.Values;
                        } else {
                            players = [];
                        }
                        // matomoStat('it://playersList/');
                        // await matomoStatWithDelay('it://playersList');

                        renderPlayerList(ejs, content, translate, api, ipcRenderer, players, pages).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }
                },
                "player/:username/": async ({ data, params }) => {
                    const characterData = await api.getPlayer(data.username);
                    if (characterData != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const userData = await api.getUser(characterData.playerData.UserId);
                        console.log(characterData)
                        // matomoStat('it://seeUser');
                        // await matomoStatWithDelay('it://seeUser');

                        renderPlayer(ejs, content, translate, api, element, characterData, userData).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }

                },
                accounts: async () => {
                    const requestUsersList = await api.getUsersList();
                    if (requestUsersList != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestUsersList.Total / requestUsersList.PageSize);
                        let users = null;
                        if (requestUsersList !== null || requestUsersList != undefined && requestUsersList.hasOwnProperty("Values")) {
                            users = requestUsersList.Values;
                        } else {
                            users = [];
                        }
                        // matomoStat('it://accountsList');
                        // await matomoStatWithDelay('it://accountsList');

                        renderAccounts(ejs, content, translate, api, users, pages).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }

                },
                "accounts/pages/:page": async ({ data, params }) => {
                    const requestUsersList = await api.getUsersList(data.page);
                    if (requestUsersList != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestUsersList.Total / requestUsersList.PageSize);
                        let users = null;
                        if (requestUsersList !== null || requestUsersList != undefined && requestUsersList.hasOwnProperty("Values")) {
                            users = requestUsersList.Values;
                        } else {
                            users = [];
                        }
                        // matomoStat('it://accountsList');
                        // await matomoStatWithDelay('it://accountsList');

                        renderAccounts(ejs, content, translate, api, users, pages).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }
                },
                "account/:id/": async ({ data, params }) => {
                    const userData = await api.getUser(data.id);
                    if (userData != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const charactersData = await api.getUserCharacters(data.id);
                        // matomoStat('it://seeAccount');
                        // await matomoStatWithDelay('it://seeAccount');

                        renderAccount(ejs, content, translate, api, element, userData, charactersData).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }

                },
                "account/:id/logs/pages/:page": async ({ data, params }) => {
                    const userLog = await api.getUserLogs(data.id, data.page);
                    if (userLog != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(userLog.Total / userLog.PageSize);
                        const logs = userLog.Values;
                        // matomoStat('it://seeAccountLog');
                        // await matomoStatWithDelay('it://seeAccountLog');

                        renderAccountLog(ejs, content, translate, ipcRenderer, logs, pages).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }

                },
                guilds: async () => {
                    const requestGuildsList = await api.getGuildsList();
                    if (requestGuildsList != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestGuildsList.Total / requestGuildsList.PageSize);
                        let guilds = null;
                        if (requestGuildsList !== null || requestGuildsList != undefined && requestGuildsList.hasOwnProperty("Values")) {
                            guilds = requestGuildsList.Values;
                        } else {
                            guilds = [];
                        }
                        // matomoStat('it://guilds');
                        // await matomoStatWithDelay('it://guilds');

                        renderGuilds(ejs, content, translate, api, ipcRenderer, guilds, pages).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }

                },
                "guilds/pages/:page": async ({ data, params }) => {
                    const requestGuildsList = await api.getGuildsList(data.page);
                    if (requestGuildsList != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestGuildsList.Total / requestGuildsList.PageSize);
                        let guilds = null;
                        if (requestGuildsList !== null || requestGuildsList != undefined && requestGuildsList.hasOwnProperty("Values")) {
                            guilds = requestGuildsList.Values;
                        } else {
                            guilds = [];
                        }
                        // matomoStat('it://guilds');
                        // await matomoStatWithDelay('it://guilds');

                        renderGuilds(ejs, content, translate, api, ipcRenderer, guilds, pages).then(router.updatePageLinks);
                    } else {
                        return goTo("/offline");
                    }
                },
                "guild/:id/pages/:page": async ({ data, params }) => {
                    const requestGuild = await api.getGuild(data.id, data.page);
                    if (requestGuild != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        // matomoStat('it://guildMember');
                        // await matomoStatWithDelay('it://guildMember');

                        renderGuildMembers(ejs, content, translate, api, ipcRenderer, element, requestGuild).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }
                },
                "guild/variables/:id": async ({ data, params }) => {
                    const requestGuild = await api.getGuild(data.id);
                    if (requestGuild != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        // matomoStat('it://guildVariable');
                        // await matomoStatWithDelay('it://guildVariable');

                        renderGuildVariables(ejs, content, translate, api, ipcRenderer, element, requestGuild).then(router.updatePageLinks);
                    } else {

                        return goTo("/offline");
                    }
                },
                variables: async () => {
                    const requestVariables = await api.getServerVariables(0);
                    console.log(requestVariables)
                    if (requestVariables != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestVariables.Total / requestVariables.PageSize);
                        renderVariables(ejs, content, translate, api, ipcRenderer, element, requestVariables, pages).then(router.updatePageLinks);
                    } else {
                        // matomoStat('it://seeGlobalVariable');
                        // await matomoStatWithDelay('it://seeGlobalVariable');

                        return goTo("/offline");
                    }

                },
                "variables/pages/:page": async ({ data, params }) => {
                    const requestVariables = await api.getServerVariables(data.page);
                    if (requestVariables != undefined) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        const pages = Math.round(requestVariables.total / requestVariables.count);
                        // matomoStat('it://seeGlobalVariable');
                        // await matomoStatWithDelay('it://seeGlobalVariable');

                        renderVariables(ejs, content, translate, api, ipcRenderer, element, requestVariables, pages).then(router.updatePageLinks);
                    } else {
                        return goTo("/offline");
                    }

                },
                about: async () => {
                    if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                        document.getElementById("mainNav").classList.remove("d-none");
                        document.getElementById("searchNav").classList.remove("d-none");
                        document.querySelector("#loading").classList.add("d-none");
                    }
                    // matomoStat('it://about');
                    // await matomoStatWithDelay('it://about');

                    renderAbout(content, translate).then(router.updatePageLinks);
                },
                update: async () => {
                    if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                        document.getElementById("mainNav").classList.remove("d-none");
                        document.getElementById("searchNav").classList.remove("d-none");
                        document.querySelector("#loading").classList.add("d-none");
                    }
                    // matomoStat('it://update');
                    // await matomoStatWithDelay('it://update');

                    renderUpdate(content, ipcRenderer, element, translate).then(router.updatePageLinks);
                },
                offline: async () => {
                    // matomoStat('it://offline');
                    // await matomoStatWithDelay('it://offline');

                    renderOffline(content, ipcRenderer, element, translate).then(router.updatePageLinks);
                },
                settings: async () => {
                    content.innerHTML = "";
                    if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                        document.getElementById("mainNav").classList.remove("d-none");
                        document.getElementById("searchNav").classList.remove("d-none");
                        document.querySelector("#loading").classList.add("d-none");
                    }
                    // matomoStat('it://settings');
                    // await matomoStatWithDelay('it://settings');

                    const settingsController = new Settings(ipcRenderer, ejs, translate, store, os)
                    settingsController.render().then(router.updatePageLinks);
                },
                rank: async () => {
                    const rankRequest = await api.getRank();
                    if (rankRequest) {
                        if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                            document.getElementById("mainNav").classList.remove("d-none");
                            document.getElementById("searchNav").classList.remove("d-none");
                            document.querySelector("#loading").classList.add("d-none");
                        }
                        // matomoStat('it://rank');
                        // await matomoStatWithDelay('it://rank');

                        renderRank(ejs, content, translate, api, element, rankRequest).then(router.updatePageLinks);
                    } else {
                        // matomoStat('it://offline');
                        // await matomoStatWithDelay('it://offline');

                        renderOffline(content, ipcRenderer, element, translate).then(router.updatePageLinks);
                    }
                },
                support: async () => {
                    if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading")) {
                        document.getElementById("mainNav").classList.remove("d-none");
                        document.getElementById("searchNav").classList.remove("d-none");
                        document.querySelector("#loading").classList.add("d-none");
                    }
                    // matomoStat('it://support');
                    // await matomoStatWithDelay('it://support');

                    renderSupport(content, translate, shell).then(router.updatePageLinks);;
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
        matomo.on('error', function (err) {
            console.log('error tracking request: ', err);
        });
    } catch (error) {
        console.log(error)
    }

}

function matomoStat(url) {
    setTimeout(() => {
        if (store.storageExist("allowAnalytic") && store.getStorage("allowAnalytic")) {
            matomo.track({
                url: `it://${url}`,
                _idts: store.getStorage("firstVisit"),
                _viewts: store.getStorage("lastVisit")
            });
        }
    }, 5000);
}

async function matomoStatWithDelay(url) {
    // return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //         matomoStat(url); // Appel à votre fonction d'origine
    //         resolve();
    //     }, 500);
    // });

    // Les paramètres de votre demande à Matomo
    const matomoUrl = 'https://analytics.thomasfds.fr/matomo.php'; // Remplacez par l'URL de votre serveur Matomo
    const siteId = 12; // L'ID de votre site ou application dans Matomo
    const pageUrl = url; // L'URL de la page à suivre

    // Créez un objet de données à envoyer à Matomo
    const data = {
        idsite: siteId,
        url: pageUrl,
        rec: 1, // Enregistrement d'une nouvelle visite
        // action_name: 'Nom de l\'action', // Facultatif, nom de l'action
    };

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    };

    return await fetch(matomoUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
    }).then(async (response) => {
        console.log("post:", response.status, " Route:", apiRoute);
        console.log('status', response.status)
        if (response.status == 401) {
            console.log("401")
        } else {
            return response.json()
        }
    }).catch(error => {
        console.log("post", error);
        return false;
    });
}


function goTo(route) {
    return router.navigate(route);
}

ipcRenderer.on("goTo", (event, arg) => {
    goTo(arg);
})

exports.startRouter = startRouter;
exports.goTo = goTo;