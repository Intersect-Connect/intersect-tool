const { ipcRenderer } = require('electron');
const { StorageManager } = require("./StorageManager");
const { Params } = require('./Params');

class RequestsManager {
    constructor() {
        this.ipcRenderer = ipcRenderer;
        this.endpoint = Params.dev ? "https://127.0.0.1:8000/api" : "https://intersect-connect.tk/api/";
        this.store = new StorageManager();
    }

    ipcSend(key, arg = null) {
        return ipcRenderer.send(key, arg);
    }

    async get(url) {
        return await fetch(this.endpoint + url)
            .then((response) => {
                console.log(response)
                if (response.status !== 200) {
                    return false;
                } else {
                    return response.json()
                }
            }).catch(error => {
                return false;
            });
    }

    async post(url, formData) {
        return await fetch(this.endpoint + url, {
            method: 'POST',
            body: formData
        }).then((response) => {
            console.log(response)
            if (response.status !== 200) {
                return false;
            } else {
                return response.json()
            }
        }).catch(error => {
            return false;
        });
    }

    async checkLogin() {
        if (Params.intersectConnect) {

            const checkData = new FormData();
            checkData.append("Token", this.store.getStorage("UserToken"));
            return await fetch(this.endpoint + "/v1/auth/check", {
                method: 'POST',
                body: checkData
            }).then((response) => {
                if (response.status !== 200) {
                    return response.json()
                } else {
                    return response.json()
                }
            }).catch(error => {
                return false;
            });
        } else {
            return true;
        }
    }

}

exports.RequestsManager = RequestsManager;