let translation = null;
let api = null;
let ipcRenderer = null;

function renderRank(ejs, content, translateLib,apiLib, ipcRendererLib, players) {
    translation = translateLib;
    api = apiLib;
    ipcRenderer = ipcRendererLib;
    return fetch("./pages/rank/rank.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            init();
            function init() {
                content.innerHTML = ejs.render(mainHtml, {
                    "players": players.Values,
                });
                translation.getTranslation();
            }
        });
};

exports.renderRank = renderRank;