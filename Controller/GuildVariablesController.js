class GuildVariablesController {
    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
        this.displayNotification = false;
        this.notification = null;
        this.html = null;
    }

    async render() {
        return fetch("./pages/guild_variables/guild_variables.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
                this.html = mainHtml;
                this.init();
            });
    };

    init() {
        let allVariables = this.controllerData.guild.variables;
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

        this.content.innerHTML = this.libs.ejs.render(this.html, {
            "guild": this.controllerData.guild.guild,
            "members": this.controllerData.guild.members.Values,
            "variables": variablesList,
            "pages": Math.round(this.controllerData.guild.members.Total / this.controllerData.guild.members.PageSize),
            "displayNotification": this.displayNotification,
            "notification": this.notification
        });
        
        this.libs.translate.getTranslation();

        const pageListSelect = document.getElementById("pageList");
        const variableForm = document.querySelectorAll(".variableForm");
        const membersLink = document.getElementById("membersLink");
        const variablesLink = document.getElementById("variablesLink");

        if (membersLink != null) {
            membersLink.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("e.target.dataset.url", e.target.dataset.url)
                return this.libs.ipcRenderer.send("goTo", e.target.dataset.url);
            })
        }


        if (variablesLink != null) {
            variablesLink.addEventListener("click", (e) => {
                e.preventDefault();
                console.log("e.target.dataset.url", e.target.dataset.url)
                return this.libs.ipcRenderer.send("goTo", e.target.dataset.url);
            })
        }


        if (pageListSelect) {
            pageListSelect.addEventListener("change", (e) => {
                let value = e.target.value;

                if (value != "PageList") {
                    return this.libs.ipcRenderer.send("goTo", `/guild/${data.guild.Id}/pages/${value}`);
                }
            })
        }

        if (variableForm) {
            variableForm.forEach(form => {
                form.addEventListener("submit", (e) => {
                    this.submitForm(e);
                });
            });
        }
    }

    async submitForm(e) {
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

        const request = await this.libs.api.setGuildVariables(this.controllerData.guild.guild.Id, variableId, value);
        if (request.hasOwnProperty("VariableId")) {
            this.displayNotification = true;
            this.notification = this.libs.element.alertSuccess("The variable has been changed");
            let guild = await this.libs.api.getGuild(this.controllerData.guild.guild.Id);
            this.controllerData.guild = guild;
            try {
                this.init();
            } catch (error) {
                console.log("error", error)
            }
        }
    }
}

exports.GuildVariablesController = GuildVariablesController