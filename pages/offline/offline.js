let ipcRenderer = null;
let element = null;
let translate = null;

function renderOffline(content, ipcRendererLib, ElementManager, translateLib) {
  ipcRenderer = ipcRendererLib;
  element = ElementManager;
  translate = translateLib;
  return fetch("./pages/offline/offline.html")
    .then((response) => response.text())
    .then((updateHtml) => {
      content.innerHTML = updateHtml;
      translate.getTranslation();
      console.log("mainNav", document.getElementById("searchNav"))
      if (document.getElementById("mainNav") && document.getElementById("mainNav") && document.querySelector("#loading") ) {
        document.getElementById("mainNav").classList.add("d-none");
        document.getElementById("searchNav").classList.add("d-none");
        document.querySelector("#loading").classList.add("d-none");
      } 

      //End of Javascript Content
    }).catch(error => {
      console.log("Error", error)
    });
};

exports.renderOffline = renderOffline;