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
      // const myModal = new modal(document.getElementById('exampleModal'))
      // console.log(myModal)


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