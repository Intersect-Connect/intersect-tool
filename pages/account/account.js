let translation = null;
let api = null;

function renderAccount(ejs, content, translateLib, data) {
    translation = translateLib;
    // const content = document.querySelector(".content");
    console.log('Load Player')
    return fetch("./pages/account/account.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            content.innerHTML = ejs.render(mainHtml, { data });
            translation.getTranslation();
        });
};

exports.renderAccount = renderAccount;