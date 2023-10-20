class GuildsController {
    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
    }

    async render() {
        return fetch("./pages/guilds/guilds.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
                this.init(mainHtml);
            });
    };

    init(mainHtml) {
        this.content.innerHTML = this.libs.ejs.render(mainHtml, {
            "guilds": this.controllerData.guilds,
            "pages": this.controllerData.pages,
            "pageActual": localStorage.getItem("guildsPages"),
            "nextPage": Number(localStorage.getItem("guildsPages")) + 1
        });
        this.libs.translate.getTranslation();

        const pageListSelect = document.getElementById("pageList");

        if (pageListSelect) {
            pageListSelect.addEventListener("change", (e) => {
                let value = e.target.value;

                if (value != "PageList") {
                    return this.libs.ipcRenderer.send("goTo", `/guilds/pages/${value}`);
                }
            })
        }
    }
}

exports.GuildsController = GuildsController;