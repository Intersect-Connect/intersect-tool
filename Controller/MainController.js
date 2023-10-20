const { TranslationManager } = require("../Utils/TranslationManager");

class MainController {
    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
        this.translation = new TranslationManager();
    }

    async render() {
        return fetch("./pages/main/main.ejs", {
            mode: "cors"
        }).then((response) => response.text())
            .then(async (mainHtml) => {
                console.log('Loaded Main')
                const playerList = this.controllerData.playerList;
                const getServerStat = this.controllerData.serverStat;
                this.analytics();
                this.content.innerHTML = this.libs.ejs.render(mainHtml, { playerList, "stat": getServerStat, "uptime": this.timeago(getServerStat.uptime) });
                this.translation.getTranslation();
            });
    };

    timeago(ms) {
        var ago = Math.floor(ms / 1000);
        var part = 0;

        if (ago < 2) { return this.translation.get()["aMomentAgo"]; }
        if (ago < 5) { return this.translation.get()["momentAgo"]; }
        if (ago < 60) {
            if (this.translation.getActualLanguage() == "fr") {
                return `Il y a ${part} ${this.translation.get()["secondAgo"]}`;
            } else {
                return ago + " seconds ago";
            }
        }

        if (ago < 120) { return this.translation.get()["aMinuteAgo"]; }
        if (ago < 3600) {
            while (ago >= 60) { ago -= 60; part += 1; }
            if (this.translation.getActualLanguage() == "fr") {
                return `Il y a ${part} ${this.translation.get()["minuteAgo"]}`;
            } else {
                return `${part} ${this.translation.get()["minuteAgo"]}`;
            }
        }

        if (ago < 7200) { return "an hour ago"; }
        if (ago < 86400) {
            while (ago >= 3600) { ago -= 3600; part += 1; }
            return part + " hours ago";
        }

        if (ago < 172800) { return "a day ago"; }
        if (ago < 604800) {
            while (ago >= 172800) { ago -= 172800; part += 1; }
            return part + " days ago";
        }

        if (ago < 1209600) { return "a week ago"; }
        if (ago < 2592000) {
            while (ago >= 604800) { ago -= 604800; part += 1; }
            return part + " weeks ago";
        }

        if (ago < 5184000) { return "a month ago"; }
        if (ago < 31536000) {
            while (ago >= 2592000) { ago -= 2592000; part += 1; }
            return part + " months ago";
        }

        if (ago < 1419120000) { // 45 years, approximately the epoch
            return "more than year ago";
        }

        return "never";
    }

    analytics() {
        // Stocker des données dans le cache avec expiration
        const key = 'cachedDataTrackUrl-index';
        const data = { url: "it://index" };
        const expiration = Date.now() + 3600000; // Expiration dans 1 heure

        const cacheData = { data, expiration };
        localStorage.setItem(key, JSON.stringify(cacheData));

        // Récupérer les données du cache
        const cachedData = localStorage.getItem(key);
        if (cachedData) {
            const parsedCache = JSON.parse(cachedData);
            if (parsedCache.expiration > Date.now()) {
                // Les données sont encore valides, utilisez-les
                const cachedData = parsedCache.data;
            } else {
                // Les données ont expiré, supprimez-les du cache
                localStorage.removeItem(key);

                if (libs.store.storageExist("allowAnalytic") && libs.store.getStorage("allowAnalytic")) {
                    libs.matomo.track({
                        url: `it://index`,
                        _idts: libs.store.getStorage("firstVisit"),
                        _viewts: libs.store.getStorage("lastVisit")
                    });
                }
            }
        }

    }

}

exports.MainController = MainController;