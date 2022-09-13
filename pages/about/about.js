function renderAbout(content, translateLib) {
  let translation =  translateLib;

  return fetch("./pages/about/about.html")
    .then((response) => response.text())
    .then((aboutHtml) => {
      content.innerHTML = aboutHtml;
      translation.getTranslation();
    });
};

exports.renderAbout = renderAbout;