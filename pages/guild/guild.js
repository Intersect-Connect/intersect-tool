let translation = null;
let api = null;
let ipcRenderer = null;

function renderGuild(ejs, content, translateLib, apiLib, ipcRendererLib, data) {
    translation = translateLib;
    api = apiLib;
    ipcRenderer = ipcRendererLib;
    return fetch("./pages/guild/guild.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            let displayNotification = false;
            let notification = null;

            init(data);

            function init(data) {
                content.innerHTML = ejs.render(mainHtml, {
                    "guild":data.guild,
                    "members":data.members.Values,
                    "pages":Math.round(data.members.Total / data.members.PageSize)
                });
                translation.getTranslation();
                const pageListSelect = document.getElementById("pageList");

                if(pageListSelect){
                    pageListSelect.addEventListener("change", (e) => {
                        let value = e.target.value;

                        if(value != "PageList"){
                            return ipcRenderer.send("goTo", `/guild/${data.guild.Id}/pages/${value}`);
                        }
                    })
                }

            }

        });
};

exports.renderGuild = renderGuild;