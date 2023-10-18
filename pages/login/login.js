let translation = null;
let store = null;
let ipcRenderer = null;
let crypto = null;
let api = null;

function renderLogin(content, translateLib, storeLib, ipcRendererLib, cryptoLib, ApiManagerLib) {
    translation = translateLib;
    store = storeLib;
    ipcRenderer = ipcRendererLib
    crypto = cryptoLib;
    api = ApiManagerLib;
    return fetch("./pages/login/login.html")
        .then((response) => response.text())
        .then((loginHtml) => {
            content.innerHTML = loginHtml;

            const form = document.getElementById("loginForm");

            form.addEventListener("submit", async(event) => {
                event.preventDefault();
                const formData = new FormData(form);
                if (
                    formData.get("username") != "" || formData.get("username") != null &&
                    formData.get("password") != "" || formData.get("password") != null
                ) {
                    const hashPwd = crypto.createHash('sha256').update(formData.get("password")).digest('hex');
                    const loginRequest = await api.validePassword(formData.get("username"), hashPwd);
                    console.log("Request", loginRequest)
                    if (loginRequest) {
                        const getUser = await api.getUser(formData.get("username"));
                        console.log(getUser)
                        if (getUser && isAdmin(getUser)) {
                            store.setStorage("accountId", getUser.Id);
                            return ipcRenderer.send("goTo", "/");
                        }
                    }
                }
            });

            function isAdmin(user) {
                if (
                    user.Power.Ban &&
                    user.Power.Editor &&
                    user.Power.Kick &&
                    user.Power.Mute
                ) {
                    return true
                } else {
                    return false;
                }
            }
        });
}
exports.renderLogin = renderLogin;