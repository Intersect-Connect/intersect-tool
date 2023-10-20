class GuildController {
    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
        this.displayNotification = false;
        this.notification = null;
    }

    async render() {
        return fetch("./pages/guild_members/guild_members.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
                this.init(mainHtml);
            });
    };

    init(mainHtml) {
        console.log(this.controllerData.guild)
        this.content.innerHTML = this.libs.ejs.render(mainHtml, {
            "guild": this.controllerData.guild.guild,
            "members": this.controllerData.members.Values,
            "pages": Math.round(this.controllerData.members.Total / this.controllerData.members.PageSize),
            "displayNotification": this.displayNotification,
            "notification": this.notification
        });
        this.libs.translate.getTranslation();
        const pageListSelect = document.getElementById("pageList");

        if (pageListSelect) {
            pageListSelect.addEventListener("change", (e) => {
                let value = e.target.value;

                if (value != "PageList") {
                    return this.libs.ipcRenderer.send("goTo", `/guild/${data.guild.Id}/pages/${value}`);
                }
            })
        }

    }
}

exports.GuildController = GuildController;