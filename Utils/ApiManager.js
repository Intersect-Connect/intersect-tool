const http = require('https');
const { StorageManager } = require('./StorageManager');
const { ipcRenderer } = require('electron');

class ApiManager {

    constructor() {
        this.store = new StorageManager();
    }

    async get(apiRoute, token) {

        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        return await fetch(this.store.getStorage("server_url") + apiRoute, {
            method: 'GET',
            headers: headers,
        })
            .then(async (response) => {
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
        return await fetch(this.store.getStorage("server_url") + apiRoute, {
            method: 'GET',
            headers: headers,
        })
            .then(async (response) => {
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

    async post(apiRoute, formData, token) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        return await fetch(this.store.getStorage("server_url") + apiRoute, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(formData)
        }).then(async (response) => {
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

    async postAuth(apiRoute, formData, token) {
        let headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.store.getStorage("api_token")}`,
        };


        return await fetch(this.store.getStorage("server_url") + apiRoute, {
            method: 'POST',
            headers: headers,
            body: formData.length != 0 ? JSON.stringify(formData) : null
        }).then(async (response) => {
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
        const formData = {
            "grant_type": "password",
            "username": this.store.getStorage("accountUsername"),
            "password": this.store.getStorage("accountPassword"),
        }

        return await this.post("/api/oauth/token", formData);
    }

    async reloadToken() {
        const authTokenRequest = await this.tokenAuth();
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
        const request = await this.getAuth(`/api/v1/users?page=${page}&pageSize=25`);
        localStorage.setItem("accountsPages", page);
        return request;
    }

    async getUser(username) {
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
        const request = await this.getAuth(`/api/v1/players?page=${page}&pageSize=25`);
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
        const formData = {
            "duration": duration,
            "reason": reason,
            "moderator": "Moderation Tools",
            "ip": true
        }
        const request = await this.postAuth(`/api/v1/players/${userId}/admin/ban`, formData);
        const getUser = await this.getUser(userId);
        if (request.Message === `${getUser.Name} has been banned!`) {
            return true;
        } else {
            return false;
        }
    }

    async unBan(userId) {
        const request = await this.postAuth(`/api/v1/players/${userId}/admin/unban`, []);
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
        const request = await this.postAuth(`/api/v1/players/${userId}/admin/unmute`, []);
        // const getUser = await this.getUser(userId);
        if (request.hasOwnProperty("Message")) {
            if (request.Message === `${userId} has been unmuted!`) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async kick(playerId){
        const kickRequest = await this.postAuth(`/api/v1/players/${playerId}/admin/kick`, []);
        return kickRequest;
    }

    async kill(playerId){
        const killRequest = await this.postAuth(`/api/v1/players/${playerId}/admin/kill`, []);
        return killRequest;
    }

    async serverStat() {
        const request = await this.getAuth("/api/v1/info/stats");
        return request;
    }

    async getUserLogs(user, page = 0) {
        const request = await this.getAuth(`/api/v1/logs/user/${user}/activity?page=${page}&pageSize=25`);
        return request;
    }

    async getGuildsList(page = 0) {
        const request = await this.getAuth(`/api/v1/guilds?page=${page}&pageSize=25`);
        return request;
    }

    async getGuild(id, page = 0) {
        const requestGuild = this.getAuth(`/api/v1/guilds/${id}`);
        const requestGuildMember = this.getAuth(`/api/v1/guilds/${id}/members?page=${page}pageSize=25`);
        const allData = await Promise.all([requestGuild, requestGuildMember]);

        const guild = {
            "guild": allData[0],
            "members": allData[1],
        }

        return guild;
        
    }
}
exports.ApiManager = ApiManager;