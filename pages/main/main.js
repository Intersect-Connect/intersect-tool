let translation = null;
let api = null;

function renderMain(ejs, content, libs, controllerData) {
    translation = libs.translate;
    api = libs.api;
    // const content = document.querySelector(".content");
    console.log('Load Main')
    return fetch("./pages/main/main.ejs", {
        mode: "cors"
    }).then((response) => response.text())
        .then(async (mainHtml) => {
            const playerList = controllerData.playerList;
            const getServerStat = controllerData.serverStat;
            analytics();

            content.innerHTML = ejs.render(mainHtml, { playerList, "stat": getServerStat, "uptime": timeago(getServerStat.uptime) });
            translation.getTranslation();

            function timeago(ms) {
                var ago = Math.floor(ms / 1000);
                var part = 0;

                if (ago < 2) { return translation.get()["aMomentAgo"]; }
                if (ago < 5) { return translation.get()["momentAgo"]; }
                if (ago < 60) {
                    if (translation.getActualLanguage() == "fr") {
                        return `Il y a ${part} ${translation.get()["secondAgo"]}`;
                    } else {
                        return ago + " seconds ago";
                    }
                }

                if (ago < 120) { return translation.get()["aMinuteAgo"]; }
                if (ago < 3600) {
                    while (ago >= 60) { ago -= 60; part += 1; }
                    if (translation.getActualLanguage() == "fr") {
                        return `Il y a ${part} ${translation.get()["minuteAgo"]}`;
                    } else {
                        return `${part} ${translation.get()["minuteAgo"]}`;
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

                // TODO pass in Date.now() and ms to check for 0 as never
                return "never";
            }
        });
};

function analytics() {
    // Stocker des données dans le cache avec expiration
    const key = 'cachedDataTrackUrl-index';
    const data = { url:"it://index" };
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

exports.renderMain = renderMain;