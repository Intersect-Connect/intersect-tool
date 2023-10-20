class AccountsController {
    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
    }

    async render() {
        return fetch("./pages/accounts/accounts.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
                this.init(mainHtml);
            });
    };

    init(mainHtml) {
        this.content.innerHTML = this.libs.ejs.render(mainHtml, {
            "users": this.controllerData.users,
            "pages": this.controllerData.pages,
            "pageActual": localStorage.getItem("accountsPages"),
            "nextPage": Number(localStorage.getItem("accountsPages")) + 1
        });
        this.libs.translate.getTranslation();

        const pageListSelect = document.getElementById("pageList");

        if (pageListSelect) {
            pageListSelect.addEventListener("change", (e) => {
                let value = e.target.value;

                if (value != "PageList") {
                    return this.libs.ipcRenderer.send("goTo", `accounts/pages/${value}`);
                }
            })
        }
    }
}

exports.AccountsController = AccountsController;