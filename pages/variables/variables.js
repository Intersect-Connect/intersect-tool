let translation = null;
let api = null;
let ipcRenderer = null;
let element = null;
function renderVariables(ejs, content, translateLib, ApiLib, ipcRendererLib, elementLib, variablesData, pages) {
    translation = translateLib;
    api = ApiLib;
    ipcRenderer = ipcRendererLib;
    element = elementLib;
    return fetch("./pages/variables/variables.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {

            init(variablesData, pages);

            function init(variables, pages) {
                let displayNotification = false;
                let notification = null;
                content.innerHTML = ejs.render(mainHtml, {
                    "variables": variables.entries,
                    "pages": pages,
                    "pageActual": localStorage.getItem("variablesPages"),
                    "nextPage": Number(localStorage.getItem("variablesPages")) + 1,
                    displayNotification,
                    notification
                });
                translation.getTranslation();

                const pageListSelect = document.getElementById("pageList");
                const variableForm = document.querySelectorAll(".variableForm");

                if (pageListSelect) {
                    pageListSelect.addEventListener("change", (e) => {
                        let value = e.target.value;

                        if (value != "PageList") {
                            return ipcRenderer.send("goTo", `/guilds/pages/${value}`);
                        }
                    })
                }

                if (variableForm) {
                    variableForm.forEach(form => {
                        form.addEventListener("submit", async (e) => {
                            e.preventDefault();

                            const formData = new FormData(form);
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

                            if(type == 2){
                                value = Number(formData.get(`variable-${variableId}`));
                                console.log(value);
                            }

                            if(type == 3){
                                value = formData.get(`variable-${variableId}`);
                            }

                            const request = await api.setServerVariables(variableId, value);
                            if (request.hasOwnProperty("VariableId")) {
                                displayNotification = true;
                                notification = element.alertSuccess("The variable has been changed");
                                await reload();
                            }
                            console.log(request)
                        })
                    })

                }
            }

            async function reload() {
                let variables = await api.getServerVariables(pages);
                return init(variables, pages);
            }
        });
};

exports.renderVariables = renderVariables;