const { ipcRenderer } = require('electron');
const { launcherVersion, devMode, steamMode, allowChangeInstallPath, includeFiles, getConfig, getLang } = require('../Utils');

class RequestsManager {
    constructor() {
        this.ipcRenderer = ipcRenderer;
        this.mageworkEndpoint = devMode ? "https://127.0.0.1:8000/api" : "https://mageworkstudios.com/api/";
        this.nightmareEndpoint = devMode ? "https://127.0.0.1:8001/en/api/" : "https://nightmare.mageworkstudios.com/en/api/";
    }

    test() {
        console.log('fs', fs.existsSync('./src/Utils/DownloadManager.js'))
        return 'Test Success';
    }

    ipcSend(key, arg = null) {
        return ipcRenderer.send(key, arg);
    }

    async getMagework(url) {
        return await fetch(this.mageworkEndpoint + url)
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

    async postMagework(url, formData) {
        return await fetch(this.mageworkEndpoint + url, {
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

    async getNightmare(url) {
        return await fetch(this.nightmareEndpoint + url)
            .then((response) => {
                if (response.status !== 200) {
                    return false;
                } else {
                    return response.json()
                }
            }).catch(error => {
                return false;
            });
    }

    async postNightmare(url, formData) {
        return await fetch(this.nightmareEndpoint + url, {
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
}

exports.RequestsManager = RequestsManager;