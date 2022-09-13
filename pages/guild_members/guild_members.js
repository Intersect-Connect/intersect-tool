let translation = null;
let api = null;
let ipcRenderer = null;
let element = null;

function renderGuildMembers(ejs, content, translateLib, apiLib, ipcRendererLib, elementLib, data) {
    translation = translateLib;
    api = apiLib;
    ipcRenderer = ipcRendererLib;
    element = elementLib;
    return fetch("./pages/guild_members/guild_members.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            let displayNotification = false;
            let notification = null;
            init(data);

            function init(data) {
                console.log(data)
                content.innerHTML = ejs.render(mainHtml, {
                    "guild": data.guild,
                    "members": data.members.Values,
                    "pages": Math.round(data.members.Total / data.members.PageSize),
                    displayNotification,
                    notification
                });
                translation.getTranslation();
                const pageListSelect = document.getElementById("pageList");

                if (pageListSelect) {
                    pageListSelect.addEventListener("change", (e) => {
                        let value = e.target.value;

                        if (value != "PageList") {
                            return ipcRenderer.send("goTo", `/guild/${data.guild.Id}/pages/${value}`);
                        }
                    })
                }

            }

        });
};

exports.renderGuildMembers = renderGuildMembers;
