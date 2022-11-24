const { RequestsManager } = require("../../Utils/RequestsManager");
const { Params } = require("../../Utils/Params")


class Settings {
  constructor(ipcRendererLib, ejs, translateLib, storeLib, osLib) {
    this.ipcRenderer = ipcRendererLib;
    this.ejs = ejs;
    this.translation = translateLib;
    this.store = storeLib;
    this.os = osLib;
    this.request = new RequestsManager();
  }

  render() {
    return fetch("./pages/settings/settings.ejs")
      .then((response) => response.text())
      .then(async (Html) => {

        this.init(Html)

        //End of Javascript Content
      });
  };

  async init(Html) {
    const checkRequest = await this.request.checkLogin();

    if (!checkRequest.Success) {
      this.store.removeStorage("UserToken");
    }

    document.querySelector(".content").innerHTML = this.ejs.render(Html, {
      "Params":Params,
      "pageSetting": this.store.getStorage("pageSetting"),
      "userToken": this.store.storageExist("UserToken"),
      "serverIdExist": this.store.storageExist("ServerId"),
      "serverId": this.store.getStorage("ServerId"),
    });
    this.translation.getTranslation();
    const languageSelect = document.getElementById("language");
    const settingForm = document.getElementById("settingForm");
    const pageSetting = document.getElementById("pageSetting");
    const analyticsCheck = document.getElementById("analytics");
    const connectForm = document.getElementById("connectForm");
    const IntersectConnectSaveButton = document.getElementById("IntersectConnectSaveButton");

    if (IntersectConnectSaveButton) {
      IntersectConnectSaveButton.addEventListener("click", async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("Token", this.store.getStorage("UserToken"));
        formData.append("ServerUrl", this.store.getStorage("server_url"));
        formData.append("AccountUsername", this.store.getStorage("accountUsername"));
        formData.append("AccountPassword", this.store.getStorage("accountPassword"));

        const saveRequest = await this.request.post("/v1/server/add", formData);

        if (saveRequest.Success) {
          this.store.setStorage("ServerId", saveRequest.ServerId);
          this.render();
        }
      });
    }

    if (connectForm) {
      connectForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(connectForm);
        formData.append("DeviceType", "Intersect Tool Window");
        formData.append("DeviceName", this.os.hostname());
        const loginRequest = await this.request.post("/v1/auth/login", formData);

        if (loginRequest.Success) {
          this.store.setStorage("UserToken", loginRequest.Token);
          this.render();
        }
      })
    }

    if (settingForm != null) {
      settingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(settingForm);

        if (formData.get("pageSetting") != null) {
          this.store.setStorage("pageSetting", formData.get("pageSetting"));
          pageSetting.value = this.store.getStorage("pageSetting");
        }
        if (analyticsCheck != null) {
          if (analyticsCheck.checked) {
            this.store.setStorage("allowAnalytic", true);
          } else {
            this.store.setStorage("allowAnalytic", false);
          }
          analyticsCheck.checked = this.store.getStorage("allowAnalytic");
        }
      })
    }

    if (pageSetting != null) {
      if (this.store.storageExist("pageSetting")) {
        // pageSetting.value = store.getStorage("pageSetting");
      } else {
        this.store.setStorage("pageSetting", 25);
        // pageSetting.value = store.getStorage("pageSetting");
      }
    }

    if (analyticsCheck != null) {
      if (this.store.storageExist("allowAnalytic")) {
        analyticsCheck.checked = this.store.getStorage("allowAnalytic");
      }
    }


    if (languageSelect) {
      languageSelect.addEventListener("change", (event) => {
        let value = event.target.value;

        if (value === "fr" || value === "en") {
          this.store.setStorage("language", value);
          this.translation.getTranslation();
        }
      })
    }
  }
}


exports.Settings = Settings;