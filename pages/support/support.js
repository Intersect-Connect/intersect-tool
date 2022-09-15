function renderSupport(content, translateLib, shellLib) {
  let translation =  translateLib;
  let shell = shellLib;

  return fetch("./pages/support/support.html")
    .then((response) => response.text())
    .then((aboutHtml) => {
      content.innerHTML = aboutHtml;
      translation.getTranslation();
      const supportButton = document.getElementById("support");

      if(supportButton){
        supportButton.addEventListener("click", (e) => {
          e.preventDefault();
          let href = e.target.dataset.href;
          shell.openExternal(href);
        })
      }
    });
};

exports.renderSupport = renderSupport;