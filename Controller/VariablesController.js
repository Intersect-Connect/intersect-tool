class VariablesController{
    constructor(content, libs, controllerData){
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
        this.displayNotification = false;
        this.notification = null;
    }

    async render() {
        return fetch("./pages/variables/variables.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
    
                this.init(mainHtml);
            });
    }

    init(mainHtml) {
        console.log(this.controllerData)
        this.content.innerHTML = this.libs.ejs.render(mainHtml, {
            "variables": this.controllerData.variables.entries,
            "pages": this.controllerData.pages,
            "pageActual": localStorage.getItem("variablesPages"),
            "nextPage": Number(localStorage.getItem("variablesPages")) + 1,
            "displayNotification": this.displayNotification,
            "notification": this.notification
        });

        this.libs.translate.getTranslation();

        const pageListSelect = document.getElementById("pageList");
        const variableForm = document.querySelectorAll(".variableForm");

        if (pageListSelect) {
            pageListSelect.addEventListener("change", (e) => {
                let value = e.target.value;

                if (value != "PageList") {
                    return this.libs.ipcRenderer.send("goTo", `/guilds/pages/${value}`);
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

                    const request = await this.libs.api.setServerVariables(variableId, value);
                    console.log("Request from controller", request)
                    if (request.hasOwnProperty("VariableId")) {
                        this.displayNotification = true;
                        this.notification = this.libs.element.alertSuccess("The variable has been changed");
                        await this.reload();
                    }
                })
            })

        }
    }

    async reload() {
        let variables = await this.libs.api.getServerVariables(this.controllerData.pages);
        this.controllerData.variables = variables;
        return init();
    }
}

exports.VariablesController = VariablesController;