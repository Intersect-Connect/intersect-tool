let translation = null;
let api = null;

function renderAccounts(ejs, content, translateLib, ApiLib, users, pages) {
    translation = translateLib;
    api = ApiLib;
    return fetch("./pages/accounts/accounts.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {

            init();

            function init() {
                content.innerHTML = ejs.render(mainHtml, {
                    "users": users,
                    "pages": pages,
                    "pageActual": localStorage.getItem("accountsPages"),
                    "nextPage": Number(localStorage.getItem("accountsPages")) + 1
                });
                translation.getTranslation();

                const pageListSelect = document.getElementById("pageList");

                if (pageListSelect) {
                    pageListSelect.addEventListener("change", (e) => {
                        let value = e.target.value;

                        if (value != "PageList") {
                            return ipcRenderer.send("goTo", `accounts/pages/${value}`);
                        }
                    })
                }
            }
        });
};

exports.renderAccounts = renderAccounts;