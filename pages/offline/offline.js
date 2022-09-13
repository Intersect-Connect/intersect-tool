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
      const installButton = document.getElementById("installButton");
      const progressBar = document.getElementById("progress");
      const downloadText = document.getElementById("downloadText");
      const loadingDiv = document.getElementById("loadingDiv");

      translate.getTranslation();
      //End of Javascript Content
    });
};

exports.renderOffline = renderOffline;