let translation = null;
let store = null;
let ipcRenderer = null;
let crypto = null;
let api = null;

function renderGetToken(content, translateLib, storeLib, ipcRendererLib, cryptoLib, ApiManagerLib) {
    translation = translateLib;
    store = storeLib;
    ipcRenderer = ipcRendererLib
    crypto = cryptoLib;
    api = ApiManagerLib;

    // const content = document.querySelector(".content");
    console.log('Load Install')
    return fetch("./pages/getToken/getToken.html")
        .then((response) => response.text())
        .then(async(mainHtml) => {
            content.innerHTML = mainHtml;
            try {
                const authTokenRequest = await api.tokenAuth();
                if (authTokenRequest.access_token) {
                    store.setStorage("api_token", authTokenRequest.access_token);
                    return ipcRenderer.send("goTo", "/login")
                }
            } catch (error) {
                const authTokenRequest = await api.tokenAuth();
                if (authTokenRequest.access_token) {
                    store.setStorage("api_token", authTokenRequest.access_token);
                    return ipcRenderer.send("goTo", "/login")
                }
            }

        });
};

exports.renderGetToken = renderGetToken;