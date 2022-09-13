let ipcRenderer = null;
let translation = null;
let store = null;

function renderSettings(content, ipcRendererLib, translateLib, storeLib) {
  ipcRenderer = ipcRendererLib;
  translation = translateLib;
  store = storeLib;
  return fetch("./pages/settings/settings.html")
    .then((response) => response.text())
    .then((Html) => {
      document.querySelector(".content").innerHTML = Html;
      translation.getTranslation();
      const languageSelect = document.getElementById("language");
      const settingForm = document.getElementById("settingForm");
      const pageSetting = document.getElementById("pageSetting");

      if (settingForm != null) {
        settingForm.addEventListener("submit", (e) => {
          e.preventDefault();
          const formData = new FormData(settingForm);

          if (formData.get("pageSetting") != null) {
            store.setStorage("pageSetting", formData.get("pageSetting"));
            pageSetting.value = store.getStorage("pageSetting");
          }
        })
      }

      if (pageSetting != null) {
        if (store.storageExist("pageSetting")) {
          pageSetting.value = store.getStorage("pageSetting");
        } else {
          store.setStorage("pageSetting", 25);
          pageSetting.value = store.getStorage("pageSetting");
        }
      }


      if (languageSelect) {
        languageSelect.addEventListener("change", (event) => {
          let value = event.target.value;

          if (value === "fr" || value === "en") {
            store.setStorage("language", value);
            translation.getTranslation();
          }
        })
      }

      //End of Javascript Content
    });
};

exports.renderSettings = renderSettings;