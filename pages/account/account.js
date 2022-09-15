let translation = null;
let api = null;
let element = null;

function renderAccount(ejs, content, translateLib, apiLib, elementLib, userData, characterData) {
    translation = translateLib;
    api = apiLib;
    element = elementLib;
    // const content = document.querySelector(".content");
    return fetch("./pages/account/account.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            let displayNotification = false;
            let notification = null;

            init();

            function init() {
                content.innerHTML = ejs.render(mainHtml, {
                    "user":userData,
                    "characters":characterData,
                    "displayNotification": displayNotification,
                    "notification": notification
                });
                translation.getTranslation();
                const sendEmailButton = document.getElementById("sendEmail");
                console.log(sendEmailButton)

                if (sendEmailButton) {
                    sendEmailButton.remove();
                    sendEmailButton.addEventListener("click", async (e) => {
                        e.preventDefault();
                        console.log("ici")

                        let userId = e.target.dataset.user;
                        sendEmailButton.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                        Loading...`;
                        sendEmailButton.disabled = true;

                        const request = await api.sendResetPasswordEmail(userId);
                    
                        console.log("Request", request)

                        if(request.hasOwnProperty("Message") && request.Message == "Password reset email sent."){
                            displayNotification = true;
                            notification = element.alertSuccess(request.Message);
                            sendEmailButton.innerHTML = `Send Reset Password Email`;
                            sendEmailButton.disabled = false;
                            init();
                        }else{
                            displayNotification = true;
                            notification = element.alertError(request.Message);
                            sendEmailButton.innerHTML = `Send Reset Password Email`;
                            sendEmailButton.disabled = false;
                            init();
                        }

                    })
                }
            }

        });
};

exports.renderAccount = renderAccount;