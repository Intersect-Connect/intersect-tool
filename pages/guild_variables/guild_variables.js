let translation = null;
let api = null;
let ipcRenderer = null;
let element = null;

function renderGuildVariables(ejs, content, translateLib, apiLib, ipcRendererLib, elementLib, data) {
    translation = translateLib;
    api = apiLib;
    ipcRenderer = ipcRendererLib;
    element = elementLib;
    return fetch("./pages/guild_variables/guild_variables.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            let displayNotification = false;
            let notification = null;

            init(data);

            function init(data) {
                let allVariables = data.variables;
                let variablesList = [];

                allVariables.forEach(element => {
                    if (element.Value == true || element.Value == false) {
                        element.Type = 1;
                    }

                    if (typeof element.Value === 'boolean' || element.Value instanceof Boolean) {
                        element.Type = 1;
                    }

                    if (Number.isInteger(element.Value)) {
                        element.Type = 2;
                    }

                    if (typeof element.Value === 'string' || element.Value instanceof String) {
                        element.Type = 3;
                    }
                    variablesList.push(element);
                });

                content.innerHTML = ejs.render(mainHtml, {
                    "guild": data.guild,
                    "members": data.members.Values,
                    "variables": variablesList,
                    "pages": Math.round(data.members.Total / data.members.PageSize),
                    displayNotification,
                    notification
                });
                translation.getTranslation();
                const pageListSelect = document.getElementById("pageList");
                const variableForm = document.querySelectorAll(".variableForm");
                const membersLink = document.getElementById("membersLink");
                const variablesLink = document.getElementById("variablesLink");

                if(membersLink != null){
                    membersLink.addEventListener("click", (e) => {
                        e.preventDefault();
                        console.log("e.target.dataset.url", e.target.dataset.url)
                        ipcRenderer.send("goTo", e.target.dataset.url);
                    })
                }

                
                if(variablesLink != null){
                    variablesLink.addEventListener("click", (e) => {
                        e.preventDefault();
                        console.log("e.target.dataset.url", e.target.dataset.url)
                        ipcRenderer.send("goTo", e.target.dataset.url);
                    })
                }


                if (pageListSelect) {
                    pageListSelect.addEventListener("change", (e) => {
                        let value = e.target.value;

                        if (value != "PageList") {
                            return ipcRenderer.send("goTo", `/guild/${data.guild.Id}/pages/${value}`);
                        }
                    })
                }

                if (variableForm) {
                    variableForm.forEach(form => {
                        form.addEventListener("submit", submitForm);
                    });
                }

                async function submitForm(e) {
                    e.preventDefault();

                    const formData = new FormData(e.target);
                    let variableId = e.target.dataset.variable;
                    let type = e.target.dataset.type;
                    let value = null;
                    if (type == 1) {
                        if (formData.get(`variable-${variableId}`) == "true") {
                            value = true;
                        }
                        if (formData.get(`variable-${variableId}`) == "false") {
                            value = false;
                        }
                    }

                    if (type == 2) {
                        value = Number(formData.get(`variable-${variableId}`));
                    }

                    if (type == 3) {
                        value = formData.get(`variable-${variableId}`);
                    }

                    const request = await api.setGuildVariables(data.guild.Id, variableId, value);
                    if (request.hasOwnProperty("VariableId")) {
                        displayNotification = true;
                        notification = element.alertSuccess("The variable has been changed");
                        let guild = await api.getGuild(data.guild.Id);
                        try {
                            init(guild);
                        } catch (error) {
                            console.log("error", error)
                        }
                    }
                }
            }
        });
};

exports.renderGuildVariables = renderGuildVariables;