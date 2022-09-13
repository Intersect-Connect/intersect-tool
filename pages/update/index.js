let ipcRenderer = null;
let element = null;
let translate = null;

function renderUpdate(content, ipcRendererLib, ElementManager, translateLib) {
  ipcRenderer = ipcRendererLib;
  element = ElementManager;
  translate = translateLib;
  return fetch("./pages/update/index.html")
    .then((response) => response.text())
    .then((updateHtml) => {
      content.innerHTML = updateHtml;
      const installButton = document.getElementById("installButton");
      const progressBar = document.getElementById("progress");
      const downloadText = document.getElementById("downloadText");
      const loadingDiv = document.getElementById("loadingDiv");

      translate.getTranslation();

      if (installButton != null) {
        installButton.addEventListener("click", () => {
          // send to main process restart and install update
          ipcRenderer.send("restart_app");
        });
      }

      ipcRenderer.send("checkUpdate");

      ipcRenderer.on('update_available', () => {
        try {
          ipcRenderer.removeAllListeners('update_available');
          console.log("Update available");
          ipcRenderer.send("downloadUpdate");
          console.log("Test", translate.get().updateText)
          downloadText.innerHTML = translate.get().updateText;
        } catch (error) {
          console.log('Error during check update')
          console.error(error);
        }
      });

      ipcRenderer.on('download-progress', (event, args) => {
        try {
          ipcRenderer.removeAllListeners('download-progress');
          console.log("Event", event)
          console.log("Args", args)

          progressBar.value = `${args.percent}`;
          progressBar.innerHTML = `${args.percent}%`;
          downloadText.innerHTML = translate.get().updateText;

        } catch (error) {
          console.log('Error during download of the update')
          console.error(error);
        }
      });

      ipcRenderer.on('update_downloaded', () => {
        try {
          ipcRenderer.removeAllListeners('update_downloaded');
          console.log("Update downloaded");
          setTimeout(() => {
            loadingDiv.remove();
            downloadText.innerHTML = "";
            element.show(installButton);
          }, 5000);

        } catch (error) {
          console.log('Error during download of the update')
          console.error(error);
        }
      });

      ipcRenderer.on("restartError", (event, args) => {
        console.log("Error", args)
      });

      //End of Javascript Content
    });
};

exports.renderUpdate = renderUpdate;