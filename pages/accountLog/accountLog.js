let translation = null;
let api = null;
let ipcRenderer = null;
function renderAccountLog(ejs, content, translateLib,ipcRendererLib, logs, pages) {
    translation = translateLib;
    ipcRenderer = ipcRendererLib;
    // api = ApiLib;
    return fetch("./pages/accountLog/accountLog.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {

            init();

            function init() {
                console.log(logs)
                content.innerHTML = ejs.render(mainHtml, {
                    "logs": logs,
                    "pages": pages
                });
                translation.getTranslation();
                const pageListSelect = document.getElementById("pageList");

                if (pageListSelect) {
                    pageListSelect.addEventListener("change", (e) => {
                        let value = e.target.value;

                        if (value != "PageList") {
                            console.log(logs)
                            return ipcRenderer.send("goTo", `account/${logs[0].UserId}/logs/pages/${value}`);
                        }
                    })
                }
            }
        });
};

exports.renderAccountLog = renderAccountLog;