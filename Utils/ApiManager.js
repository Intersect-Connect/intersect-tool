const http = require('https');
const fetch = require('node-fetch');
const { StorageManager } = require('./StorageManager');
const { RequestsManager } = require('./RequestsManager');
const { ipcRenderer } = require('electron');
const { Params } = require("./Params")

class ApiManager {

    constructor() {
        this.store = new StorageManager();
        this.request = new RequestsManager();
        this.server_url = null;
        this.accountUsername = null;
        this.accountPassword = null;
    }


    async checkLogin() {
        if (Params.intersectConnect) {
            if (this.store.storageExist("UserToken") && this.store.storageExist("ServerId")) {
                const requestCheckLogin = await this.request.checkLogin();

                if (requestCheckLogin.Success) {
                    console.log("User Logged");
                    const getData = await this.getServerData();
                    if (getData.Success) {
                        this.setServerUrl(getData.ServerUrl);
                        this.setUsername(getData.AccountUsername);
                        this.setPassword(getData.AccountPassword);
                    }
                }
            } else {
                this.setServerUrl(this.store.getStorage("server_url"));
                this.setUsername(this.store.getStorage("accountUsername"));
                this.setPassword(this.store.getStorage("accountPassword"));
            }
        } else {
            this.setServerUrl(this.store.getStorage("server_url"));
            this.setUsername(this.store.getStorage("accountUsername"));
            this.setPassword(this.store.getStorage("accountPassword"));
        }
    }

    setServerUrl(server) {
        this.server_url = server;
        return this.server_url;
    }

    setUsername(username) {
        this.accountUsername = username;
        return this.accountUsername;
    }

    setPassword(password) {
        this.accountPassword = password;
        return this.accountPassword;
    }

    getServerUrl() {
        return this.server_url;
    }

    getUsername() {
        return this.accountUsername;
    }

    getPassword() {
        return this.accountPassword;
    }

    async getServerData() {
        const formData = new FormData();
        formData.append("Token", this.store.getStorage("UserToken"));
        return await this.request.post("/v1/server/" + this.store.getStorage("ServerId"), formData)
    }


    async get(apiRoute, token) {

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        return await fetch(this.getServerUrl() + apiRoute, {
            method: 'GET',
            headers: headers,
        })
            .then(async (response) => {
                console.log("get:", response.status, " Route:", apiRoute);
                if (response.status == 401) {
                    await this.reloadToken();
                    await this.get(apiRoute);
                } else {
                    return response.json()
                }

            }).catch(error => {
                return ipcRenderer.send("goTo", "/offline");
            });
    }

    async getAuth(apiRoute) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.store.getStorage("api_token")}`,
        };
        return await fetch(this.server_url + apiRoute, {
            method: 'GET',
            headers: headers,
            mode: "cors"
        })
            .then(async (response) => {
                console.log("getAuth:", response.status, " Route:", apiRoute);

                if (response.status == 401) {
                    await this.reloadToken();
                    await this.get(apiRoute);
                } else {
                    if (response.status == 404) {
                        return { "Message": "Not found" };
                    } else {
                        return response.json()
                    }
                }
            }).catch(error => {
                return ipcRenderer.send("goTo", "/offline");
            });
    }

    async post(apiRoute, formData, token) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        return await fetch(this.getServerUrl() + apiRoute, {
            method: 'POST',
            headers: headers,
            mode: "cors",
            body: JSON.stringify(formData)
        }).then(async (response) => {
            console.log("post:", response.status, " Route:", apiRoute);
            if (response.status == 401) {
                await this.reloadToken();
                await this.get(apiRoute);
            } else {
                return response.json()
            }
        }).catch(error => {
            return false;
        });
    }

    async postAuth(apiRoute, formData, token) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.store.getStorage("api_token")}`,
        };


        return await fetch(this.getServerUrl() + apiRoute, {
            method: 'POST',
            headers: headers,
            body: formData.length != 0 ? JSON.stringify(formData) : null
        }).then(async (response) => {
            console.log("postAuth:", response.status, " Route:", apiRoute);
            if (response.status == 401) {
                await this.reloadToken();
                await this.get(apiRoute);
            } else {
                return response.json()
            }
        }).catch(error => {
            ipcRenderer.send("goTo", "/offline");
        });
    }

    async tokenAuth() {
        let formData = null;
        if (this.store.storageExist("UserToken") && this.store.storageExist("ServerId")) {
            formData = {
                "grant_type": "password",
                "username": this.getUsername(),
                "password": this.getPassword()
            }
        } else {
            formData = {
                "grant_type": "password",
                "username": this.getUsername(),
                "password": this.getPassword()
            }
        }

        console.log("FormData", formData)


        return await this.post("/api/oauth/token", formData);
    }

    async reloadToken() {
        const authTokenRequest = await this.tokenAuth();
        console.log("authTokenRequest", authTokenRequest)
        if (authTokenRequest.access_token) {
            this.store.setStorage("api_token", authTokenRequest.access_token);
            return true;
        }
    }

    async validePassword(username, password) {
        const formData = {
            "password": password
        }
        const request = await this.postAuth(`/api/v1/users/${username}/password/validate`, formData);
        if (request.Message == "Password Correct") {
            return true;
        } else {
            if (request.Message == "Authorization has been denied for this request.") {
                await this.reloadToken();
                return await this.validePassword(username, password);
            } else {
                return false;
            }
        }
    }

    async getUsersList(page = 0) {
        const request = await this.getAuth(`/api/v1/users?page=${page}&pageSize=${this.store.getStorage("pageSetting")}`);
        localStorage.setItem("accountsPages", page);
        return request;
    }

    async getUser(username) {
        console.log("Username", username)
        const request = await this.getAuth(`/api/v1/users/${username}/`);
        return request;
    }

    async getUserCharacters(username) {
        const request = await this.getAuth(`/api/v1/users/${username}/players`);
        return request;
    }

    async getOnlineList(page = 0) {
        try {
            const formData = {
                "page": 0,
                "count": 100
            }
            const request = await this.postAuth("/api/v1/players/online", formData);
            return request;
        } catch (error) {
            return [];
        }

    }

    async getOnlineCount() {
        try {
            const request = await this.getAuth("/api/v1/players/online/count");
            return request;
        } catch (error) {
            return 0;
        }

    }

    async getPlayersList(page = 0) {
        const request = await this.getAuth(`/api/v1/players?page=${page}&pageSize=${this.store.getStorage("pageSetting")}`);
        localStorage.setItem("playersPages", page);
        return request;
    }

    async getPlayer(username) {
        const requestGetPlayer = this.getAuth(`/api/v1/players/${username}`);
        const requestGetInventory = this.getAuth(`/api/v1/players/${username}/items/inventory`);
        const requestGetBank = this.getAuth(`/api/v1/players/${username}/items/bank`);
        const allData = await Promise.all([requestGetPlayer, requestGetInventory, requestGetBank]);
        const player = {
            "playerData": allData[0],
            "inventory": allData[1],
            "bank": allData[2]
        }
        return player;
    }

    async giveItem(user, itemId, quantity) {
        const formData = {
            "itemid": itemId,
            "quantity": quantity,
            "bankoverflow": false
        }
        const request = await this.postAuth(`/api/v1/players/${user}/items/give`, formData);
        if (request.hasOwnProperty("id")) {
            return true;
        } else {
            if (request.hasOwnProperty("Message")) {
                if (request.Message == "Invalid item id.") {
                    return false;
                }
            } else {
                return false
            }
        }
    }

    async takeItem(user, itemId, quantity) {
        const formData = {
            "itemid": itemId,
            "quantity": quantity,
        }
        const request = await this.postAuth(`/api/v1/players/${user}/items/take`, formData);
        if (request.hasOwnProperty("ItemId")) {
            return true;
        } else {
            return false;
        }
    }

    async ban(userId, duration, reason) {
        console.log(userId)
        const formData = {
            "duration": duration,
            "reason": reason,
            "moderator": "Moderation Tools",
            "ip": true
        }
        const request = await this.postAuth(`/api/v1/users/${userId}/admin/ban`, formData);
        const getUser = await this.getUser(userId);
        if (request.Message === `${getUser.Name} has been banned!`) {
            return true;
        } else {
            return false;
        }
    }

    async unBan(userId) {
        const request = await this.postAuth(`/api/v1/users/${userId}/admin/unban`, []);
        const getUser = await this.getUser(userId);
        if (request.Message == `${getUser.Name} has been unbanned!`) {
            return true;
        } else {
            return false;
        }
    }

    async mute(userId, duration, reason) {
        const formData = {
            "duration": duration,
            "reason": reason,
            "moderator": "Moderation Tools",
            "ip": true
        }
        const request = await this.postAuth(`/api/v1/users/${userId}/admin/mute`, formData);
        const getUser = await this.getUser(userId);

        if (request.Message === `${getUser.Name} has been muted!`) {
            return true;
        } else {
            return false;
        }
    }

    async unMute(userId) {
        const request = await this.postAuth(`/api/v1/users/${userId}/admin/unmute`, []);
        const getUser = await this.getUser(userId);
        if (request.hasOwnProperty("Message")) {
            if (request.Message === `${getUser.Name} has been unmuted!`) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async kick(playerId) {
        const kickRequest = await this.postAuth(`/api/v1/players/${playerId}/admin/kick`, []);
        return kickRequest;
    }

    async kill(playerId) {
        const killRequest = await this.postAuth(`/api/v1/players/${playerId}/admin/kill`, []);
        return killRequest;
    }

    async serverStat() {
        const request = await this.getAuth("/api/v1/info/stats");
        return request;
    }

    async getUserLogs(user, page = 0) {
        const request = await this.getAuth(`/api/v1/logs/user/${user}/activity?page=${page}&pageSize=${this.store.getStorage("pageSetting")}`);
        return request;
    }

    async getGuildsList(page = 0) {
        const request = await this.getAuth(`/api/v1/guilds?page=${page}&pageSize=${this.store.getStorage("pageSetting")}`);
        return request;
    }

    async getGuild(id, page = 0) {
        const requestGuild = this.getAuth(`/api/v1/guilds/${id}`);
        const requestGuildMember = this.getAuth(`/api/v1/guilds/${id}/members?page=${page}pageSize=${this.store.getStorage("pageSetting")}`);
        const requestGuildVariable = this.getAuth(`/api/v1/guilds/${id}/variables`);
        const allData = await Promise.all([requestGuild, requestGuildMember, requestGuildVariable]);

        const guild = {
            "guild": allData[0],
            "members": allData[1],
            "variables": allData[2]
        }

        return guild;
    }

    async getServerVariables(page = 0) {
        const formData = {
            "page": page,
            "count": 25,
        }
        const request = await this.postAuth(`/api/v1/variables/global`, formData);
        console.log(request);
        return request;
    }

    async setServerVariables(variableId, value) {
        const formData = {
            "value": value,
        }
        const request = await this.postAuth(`/api/v1/variables/global/${variableId}`, formData);
        console.log(request);
        return request;
    }

    async setGuildVariables(guildId, variableId, value) {
        const formData = {
            "value": value,
        }
        const request = await this.postAuth(`/api/v1/guilds/${guildId}/variables/${variableId}`, formData);
        console.log(request);
        return request;
    }

    async getRank() {
        const request = await this.getAuth("/api/v1/players/rank?pageSize=100&sortDirection=Descending");
        return request;
    }

    async sendResetPasswordEmail(userId) {
        const request = await this.getAuth(`/api/v1/users/${userId}/password/reset`);
        console.log(request);
        return request;
    }
}
exports.ApiManager = ApiManager;