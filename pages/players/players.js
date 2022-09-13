let translation = null;
let api = null;
let ipcRenderer = null;

function renderPlayerList(ejs, content, translateLib,apiLib, ipcRendererLib, players, pages) {
    translation = translateLib;
    api = apiLib;
    ipcRenderer = ipcRendererLib;
    return fetch("./pages/players/players.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            init();
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
        });
};

exports.renderPlayerList = renderPlayerList;