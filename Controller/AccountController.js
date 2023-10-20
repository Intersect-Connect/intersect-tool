class AccountController {
    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
        this.notification = null;
        this.displayNotification = false;
    }

    async render() {
        return fetch("./pages/account/account.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
                this.init(mainHtml);
            });
    };

    init(mainHtml) {
        console.log(this.controllerData)
        this.content.innerHTML = this.libs.ejs.render(mainHtml, {
            "user":this.controllerData.userData,
            "characters":this.controllerData.charactersData,
            "displayNotification": this.displayNotification,
            "notification": this.notification
        });

        this.libs.translate.getTranslation();
        const sendEmailButton = document.getElementById("sendEmail");

        if (sendEmailButton) {
            sendEmailButton.remove();
            sendEmailButton.addEventListener("click", async (e) => {
                e.preventDefault();

                let userId = e.target.dataset.user;
                sendEmailButton.innerHTML = `<span class="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                Loading...`;
                sendEmailButton.disabled = true;

                const request = await this.libs.api.sendResetPasswordEmail(userId);
            
                if(request.hasOwnProperty("Message") && request.Message == "Password reset email sent."){
                    this.displayNotification = true;
                    this.notification = this.libs.element.alertSuccess(request.Message);
                    sendEmailButton.innerHTML = `Send Reset Password Email`;
                    sendEmailButton.disabled = false;
                    init();
                }else{
                    this.displayNotification = true;
                    this.notification = this.libs.element.alertError(request.Message);
                    sendEmailButton.innerHTML = `Send Reset Password Email`;
                    sendEmailButton.disabled = false;
                    init();
                }

            })
        }
    }
}

exports.AccountController = AccountController;