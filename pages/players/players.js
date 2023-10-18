let translation = null;
let api = null;
let ipcRenderer = null;

function renderPlayerList(ejs, content, translateLib, apiLib, ipcRendererLib, players, pages) {
    translation = translateLib;
    api = apiLib;
    ipcRenderer = ipcRendererLib;
    return fetch("./pages/players/players.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            init();
            analytics();

            
        });
};

function init() {
    content.innerHTML = ejs.render(mainHtml, {
        "players": players,
        "pages": pages,
        "pageActual": localStorage.getItem("playersPages"),
        "nextPage": Number(localStorage.getItem("playersPages")) + 1
    });
    translation.getTranslation();

    const pageListSelect = document.getElementById("pageList");

    if (pageListSelect) {
        pageListSelect.addEventListener("change", (e) => {
            let value = e.target.value;

            if (value != "PageList") {
                return ipcRenderer.send("goTo", `/accounts/pages/${value}`);
            }
        })
    }
}

function analytics() {
    // Stocker des données dans le cache avec expiration
    const key = 'cachedDataTrackUrl-playersList';
    const data = { url: "it://playersList" };
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

exports.renderPlayerList = renderPlayerList;