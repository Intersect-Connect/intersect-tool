let translation = null;
let api = null;
let ipcRenderer = null;
function renderGuilds(ejs, content, translateLib, ApiLib,ipcRendererLib, guilds, pages) {
    translation = translateLib;
    api = ApiLib;
    ipcRenderer = ipcRendererLib;
    return fetch("./pages/guilds/guilds.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {

            init();

            function init() {
                content.innerHTML = ejs.render(mainHtml, {
                    "guilds": guilds,
                    "pages": pages,
                    "pageActual": localStorage.getItem("guildsPages"),
                    "nextPage": Number(localStorage.getItem("guildsPages")) + 1
                });
                translation.getTranslation();

                const pageListSelect = document.getElementById("pageList");

                if(pageListSelect){
                    pageListSelect.addEventListener("change", (e) => {
                        let value = e.target.value;

                        if(value != "PageList"){
                            return ipcRenderer.send("goTo", `/guilds/pages/${value}`);
                        }
                    })
                }
            }
        });
};

exports.renderGuilds = renderGuilds;