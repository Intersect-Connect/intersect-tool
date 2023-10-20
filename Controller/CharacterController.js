class CharacterController {

    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
        this.displayNotification = false;
        this.notification = null;
        this.html = null;
    }

    async render() {
        return fetch("./pages/player/player.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
                this.html = mainHtml;

                if (localStorage.getItem("previewsPlayerTab") === null) {
                    localStorage.setItem("previewsPlayerTab", "characterData")
                }

                console.log("previewsPlayerTab", localStorage.getItem("previewsPlayerTab"))
                this.init(this.html, this.controllerData.characterData, this.controllerData.userData);
            });
    };

    async init(mainHtml, character, user) {
        console.log("user",user)
        this.content.innerHTML = this.libs.ejs.render(mainHtml, {
            "characterData": character.playerData,
            "inventory": this.empty(character.inventory),
            "bank": this.empty(character.bank),
            "userData": user,
            "displayNotification": this.displayNotification,
            "notification": this.notification,
            "previousTab": localStorage.getItem("previewsPlayerTab") == "inventaire" ? localStorage.getItem("previewsPlayerTab") : null
        });

        const banButton = document.getElementById("banButton")
        const unbanButton = document.getElementById("unbanButton")
        const muteButton = document.getElementById("muteButton");
        const unmuteButton = document.getElementById("unmuteButton");
        const giveButton = document.getElementById("giveButton");
        const takeButton = document.getElementById("takeButton");
        const kickButton = document.getElementById("kickButton");
        const killButton = document.getElementById("killButton");
        const itemsForm = document.querySelectorAll(".itemsForm");
        const characterTab = document.getElementById("pills-character-tab");
        const penaltiesTab = document.getElementById("pills-penalties-tab");
        const itemsTab = document.getElementById("pills-items-tab");
        const inventoryTab = document.getElementById("pills-inventaire-tab");
        const bankTab = document.getElementById("pills-bank-tab");
        console.log(characterTab, penaltiesTab, itemsTab, inventoryTab, bankTab);

        if (characterTab) {
            characterTab.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.setItem("previewsPlayerTab", "characterData");
            })
        }

        if (penaltiesTab) {
            penaltiesTab.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.setItem("previewsPlayerTab", "penalties");
            })
        }

        if (itemsTab) {
            itemsTab.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.setItem("previewsPlayerTab", "items");
            })
        }

        if (inventoryTab) {
            inventoryTab.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.setItem("previewsPlayerTab", "inventaire");
            })
        }


        if (bankTab) {
            bankTab.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.setItem("previewsPlayerTab", "bank");
            })
        }

        if (itemsForm) {
            itemsForm.forEach((form) => {
                form.addEventListener("submit", async (e) => {
                    e.preventDefault();
                    const formData = new FormData(form);
                    let itemId = e.target.dataset.item;
                    let submit_type = e.submitter.value;
                    let quantity = formData.get("quantity");
                    console.log("ItemId", itemId);
                    console.log("Submit Type", submit_type);
                    console.log("Quantity", formData.get("quantity"));

                    if (submit_type == "give") {
                        this.giveItem(e, itemId, quantity);
                    }

                    if (submit_type == "take") {
                        this.takeItem(e, itemId, quantity);
                    }
                })
            });
        }

        if (banButton) {
            banButton.addEventListener("click", () => {
                this.ban();
            });
        }

        if (unbanButton) {
            unbanButton.addEventListener("click", () => {
                this.unban()
            });
        }

        if (muteButton) {
            muteButton.addEventListener("click", () => {
                this.mute();
            })
        }

        if (unmuteButton) {
            unmuteButton.addEventListener("click", () => {
                this.unmute();
            })
        }

        if (giveButton) {
            giveButton.addEventListener("click", () => {
                this.giveItem()
            })
        }

        if (takeButton) {
            takeButton.addEventListener("click", () => {
                this.takeItem();
            })
        }

        if (kickButton) {
            kickButton.addEventListener("click", () => {
                this.kick();
            });
        }

        if (killButton) {
            killButton.addEventListener("click", () => {
                this.kill();
            });
        }
        this.libs.translate.getTranslation();

    }

    /**
     * Ban Player
     * @returns 
     */
    async ban() {
        localStorage.setItem("previewsPlayerTab", "characterData")
        const formData = new FormData(document.getElementById("sanctionForm"));

        let duration = formData.get("duration");
        let reason = formData.get("reason");

        if (duration != null && reason != null) {
            const banRequest = await this.libs.api.ban(characterData.playerData.UserId, duration, reason);
            console.log("Requête ban", banRequest)
            if (banRequest) {
                await this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.element.alertSuccess(this.libs.translate.get()["banSuccess"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            } else {
                await this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            }
        } else {
            await this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = this.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        }
    }

    /**
     * Unban Player
     * @returns 
     */
    async unban() {
        localStorage.setItem("previewsPlayerTab", "characterData")
        const unbanRequest = await this.libs.api.unBan(characterData.playerData.UserId);
        if (unbanRequest) {
            await this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = element.alertSuccess(this.libs.translate.get()["unBanSuccess"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        } else {
            await this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = element.alertError(this.libs.translate.get()["errorMessageDefault"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        }
    }

    /**
     * Mute Player
     * @returns 
     */
    async mute() {
        localStorage.setItem("previewsPlayerTab", "characterData")
        const formData = new FormData(document.getElementById("sanctionForm"));

        let duration = formData.get("duration");
        let reason = formData.get("reason");

        if (duration != null && reason != null) {
            const banRequest = await this.libs.api.mute(characterData.playerData.UserId, duration, reason);
            console.log("Mute", banRequest)
            if (banRequest) {
                this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.element.alertSuccess(this.translate.get()["muteSuccess"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            } else {
                this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.element.alertError(this.translate.get()["errorMessageDefault"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            }
        } else {
            this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = this.element.alertError(this.translate.get()["errorMessageDefault"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        }
    }

    /**
     * Unmute player
     * @returns 
     */
    async unmute() {
        localStorage.setItem("previewsPlayerTab", "characterData")
        const unbanRequest = await this.libs.api.unMute(characterData.playerData.UserId);
        if (unbanRequest) {
            await this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = this.element.alertSuccess(this.libs.translate.get()["unMuteSucces"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        } else {
            await this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = this.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        }
    }

    /**
     * Give item to Player
     * @param {*} e 
     * @returns 
     */
    async giveItem(e, item, quant) {
        e.preventDefault();
        const formData = new FormData(document.getElementById("giveItem"));

        let itemId = null;
        let quantity = null;

        if (item == null && quant == null) {
            itemId = formData.get("itemId");
            quantity = formData.get("quantity");
            localStorage.setItem("previewsPlayerTab", "characterData")
        } else {
            itemId = item;
            quantity = quant;
            localStorage.setItem("previewsPlayerTab", "inventaire");
        }

        if (itemId != null && quantity != 0) {
            const giveRequest = await this.libs.api.giveItem(this.controllerData.characterData.playerData.Name, itemId, quantity);
            console.log(giveRequest);
            if (giveRequest) {
                await this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.libs.element.alertSuccess(this.libs.translate.get()["itemGiveSuccess"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            } else {
                await this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.libs.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            }
        } else {
            await this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = this.libs.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        }
    }

    /**
     * Take Item to Player
     * @param {*} e 
     * @returns 
     */
    async takeItem(e, item = null, quant = null) {
        e.preventDefault();
        const formData = new FormData(document.getElementById("giveItem"));
        let itemId = null;
        let quantity = null;

        if (item == null && quant == null) {
            itemId = formData.get("itemId");
            quantity = formData.get("quantity");
            localStorage.setItem("previewsPlayerTab", "characterData")
        } else {
            itemId = item;
            quantity = quant;
            localStorage.setItem("previewsPlayerTab", "inventaire");
        }

        if (itemId != null && quantity != 0) {
            const takeRequest = await this.libs.api.takeItem(this.controllerData.characterData.playerData.Name, itemId, quantity);
            console.log(takeRequest);
            if (takeRequest) {
                await this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.libs.element.alertSuccess(this.libs.translate.get()["itemTakeSuccess"]);
                console.log("Data", this.controllerData)
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            } else {
                await this.reloadPlayerData();
                this.displayNotification = true;
                this.notification = this.libs.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            }
        } else {
            await this.reloadPlayerData();
            this.displayNotification = true;
            this.notification = this.libs.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        }
    }

    async reloadPlayerData() {
        const characterData = await this.libs.api.getPlayer(this.controllerData.characterData.playerData.Id);
        const userData = await this.libs.api.getUser(this.controllerData.characterData.playerData.UserId);
        console.log("Reload", characterData)
        this.controllerData.characterData = characterData;
        this.controllerData.userData = userData;
    }

    async kick(e) {
        e.preventDefault();
        localStorage.setItem("previewsPlayerTab", "characterData")
        const kickRequest = await this.libs.api.kick(this.controllerData.characterData.playerData.Name);
        console.log(kickRequest)
        if (kickRequest.hasOwnProperty("Message") && kickRequest.Message != `${this.controllerData.characterData.playerData.Name} has been kicked by the server!`) {
            this.displayNotification = true;
            this.notification = this.libs.element.alertInfo(kickRequest.Message);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        } else {
            if (kickRequest.hasOwnProperty("Message") && kickRequest.Message == `${this.controllerData.characterData.playerData.Name} has been kicked by the server!`) {
                this.displayNotification = true;
                this.notification = this.libs.element.alertInfo(kickRequest.Message);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            } else {
                this.displayNotification = true;
                this.notification = this.libs.element.alertError(this.translate.get()["errorMessageDefault"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            }

        }
    }

    async kill(e) {
        e.preventDefault();
        const killRequest = await this.libs.api.kill(this.controllerData.characterData.playerData.Name);
        console.log(killRequest)
        localStorage.setItem("previewsPlayerTab", "characterData")
        if (killRequest.hasOwnProperty("Message") && killRequest.Message != `${this.controllerData.characterData.playerData.Name} has been killed!`) {
            this.displayNotification = true;
            this.notification = this.libs.element.alertInfo(killRequest.Message);
            return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
        } else {
            if (killRequest.hasOwnProperty("Message") && killRequest.Message == `${this.controllerData.characterData.playerData.Name} has been killed!`) {
                this.displayNotification = true;
                this.notification = this.libs.element.alertInfo(killRequest.Message);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            } else {
                this.displayNotification = true;
                this.notification = this.libs.element.alertError(this.libs.translate.get()["errorMessageDefault"]);
                return this.init(this.html, this.controllerData.characterData, this.controllerData.userData)
            }

        }
    }

    empty(data) {
        console.log(data)
        return data.filter((data) => data.ItemId != "00000000-0000-0000-0000-000000000000");
    }
}

exports.CharacterController = CharacterController;