let translation = null;
let store = null;
let ipcRenderer = null;
let crypto = null;
let api = null;

function renderInstall(content, translateLib, storeLib, ipcRendererLib, cryptoLib, ApiManagerLib) {
    translation = translateLib;
    store = storeLib;
    ipcRenderer = ipcRendererLib
    crypto = cryptoLib;
    api = ApiManagerLib;

    // const content = document.querySelector(".content");
    console.log('Load Install')
    return fetch("./pages/install/install.html")
        .then((response) => response.text())
        .then((mainHtml) => {
            content.innerHTML = mainHtml;
            // translation.getTranslation();
            const installForm = document.getElementById("installForm");
            const languageSelect = document.getElementById("language");

            if (languageSelect) {
                languageSelect.addEventListener("change", (event) => {
                    let value = event.target.value;

                    if (value === "fr" || value === "en") {
                        store.setStorage("language", value);
                        translation.getTranslation();
                    }
                })
            }

            if (installForm) {
                installForm.addEventListener("submit", (e) => {
                    e.preventDefault();
                    const formData = new FormData(installForm);
                    console.log(formData.get("ip"));

                    if (
                        formData.get("ip") != "" || formData.get("ip") != null &&
                        formData.get("port") != "" || formData.get("port") != null &&
                        formData.get("username") != "" || formData.get("username") != null &&
                        formData.get("password") != "" || formData.get("password") != null &&
                        formData.get("version") != "" || formData.get("version") != null

                    ) {
                        const hashPwd = crypto.createHash('sha256').update(formData.get("password")).digest('hex');
                        if( formData.get("version") === "http"){
                            store.setStorage("server_url", `http://${formData.get("ip")}:${formData.get("port")}`);
                        }
                        if( formData.get("version") === "https"){
                            store.setStorage("server_url", `https://${formData.get("ip")}:${formData.get("port")}`);
                        }
                        store.setStorage("accountUsername", formData.get("username"));
                        store.setStorage("accountPassword", hashPwd);
                        store.setStorage("httpVersion",  formData.get("version"));
                        ipcRenderer.send("goTo", "/getToken");
                    }
                });
            }
        });
};

exports.renderInstall = renderInstall;