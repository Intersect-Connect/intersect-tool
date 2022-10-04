let translation = null;
let api = null;
let element = null;

function renderPlayer(ejs, content, translateLib, apiLib, elementLib, characterData, userData) {
    translation = translateLib;
    api = apiLib;
    element = elementLib;
    return fetch("./pages/player/player.ejs")
        .then((response) => response.text())
        .then(async (mainHtml) => {
            let displayNotification = false;
            let notification = null;

            if (localStorage.getItem("previewsPlayerTab") === null) {
                localStorage.setItem("previewsPlayerTab", "characterData")
            }

            console.log("previewsPlayerTab", localStorage.getItem("previewsPlayerTab"))
            init(characterData, userData);

            async function init(character, user) {
                console.log(localStorage.getItem("previewsPlayerTab") == "inventaire" ? localStorage.getItem("previewsPlayerTab") : null)
                content.innerHTML = ejs.render(mainHtml, {
                    "characterData": character.playerData,
                    "inventory": empty(character.inventory),
                    "bank": empty(character.bank),
                    "userData": user,
                    "displayNotification": displayNotification,
                    "notification": notification,
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
                                giveItem(e, itemId, quantity);
                            }

                            if (submit_type == "take") {
                                takeItem(e, itemId, quantity);
                            }
                        })
                    });
                }

                if (banButton) {
                    banButton.addEventListener("click", ban)
                }

                if (unbanButton) {
                    unbanButton.addEventListener("click", unban)
                }

                if (muteButton) {
                    muteButton.addEventListener("click", mute)
                }

                if (unmuteButton) {
                    unmuteButton.addEventListener("click", unmute)
                }

                if (giveButton) {
                    giveButton.addEventListener("click", giveItem)
                }

                if (takeButton) {
                    takeButton.addEventListener("click", takeItem)
                }

                if (kickButton) {
                    kickButton.addEventListener("click", kick);
                }

                if (killButton) {
                    killButton.addEventListener("click", kill);
                }
                translation.getTranslation();

            }

            /**
             * Ban Player
             * @returns 
             */
            async function ban() {
                localStorage.setItem("previewsPlayerTab", "characterData")
                const formData = new FormData(document.getElementById("sanctionForm"));

                let duration = formData.get("duration");
                let reason = formData.get("reason");

                if (duration != null && reason != null) {
                    const banRequest = await api.ban(characterData.playerData.UserId, duration, reason);
                    console.log("Requête ban",banRequest)
                    if (banRequest) {
                        await reloadPlayerData();
                        displayNotification = true;
                        notification = element.alertSuccess(translation.get()["banSuccess"]);
                        return init(characterData, userData)
                    } else {
                        await reloadPlayerData();
                        displayNotification = true;
                        notification = element.alertError(translation.get()["errorMessageDefault"]);
                        return init(characterData, userData);
                    }
                } else {
                    await reloadPlayerData();
                    displayNotification = true;
                    notification = element.alertError(translation.get()["errorMessageDefault"]);
                    return init(characterData, userData);
                }
            }

            /**
             * Unban Player
             * @returns 
             */
            async function unban() {
                localStorage.setItem("previewsPlayerTab", "characterData")
                const unbanRequest = await api.unBan(characterData.playerData.UserId);
                if (unbanRequest) {
                    await reloadPlayerData();
                    displayNotification = true;
                    notification = element.alertSuccess(translation.get()["unBanSuccess"]);
                    return init(characterData, userData)
                } else {
                    await reloadPlayerData();
                    displayNotification = true;
                    notification = element.alertError(translation.get()["errorMessageDefault"]);
                    return init(characterData, userData);
                }
            }

            /**
             * Mute Player
             * @returns 
             */
            async function mute() {
                localStorage.setItem("previewsPlayerTab", "characterData")
                const formData = new FormData(document.getElementById("sanctionForm"));

                let duration = formData.get("duration");
                let reason = formData.get("reason");

                if (duration != null && reason != null) {
                    const banRequest = await api.mute(characterData.playerData.UserId, duration, reason);
                    console.log("Mute", banRequest)
                    if (banRequest) {
                        characterData = await api.getPlayer(characterData.playerData.Id);
                        userData = await api.getUser(characterData.playerData.UserId);
                        displayNotification = true;
                        notification = element.alertSuccess(translation.get()["muteSuccess"]);
                        return init(characterData, userData);
                    } else {
                        characterData = await api.getPlayer(characterData.playerData.Id);
                        userData = await api.getUser(characterData.playerData.UserId);
                        displayNotification = true;
                        notification = element.alertError(translation.get()["errorMessageDefault"]);
                        return init(characterData, userData);
                    }
                } else {
                    characterData = await api.getPlayer(characterData.playerData.Id);
                    userData = await api.getUser(characterData.playerData.UserId);
                    displayNotification = true;
                    notification = element.alertError(translation.get()["errorMessageDefault"]);
                    return init(characterData, userData);
                }
            }

            /**
             * Unmute player
             * @returns 
             */
            async function unmute() {
                localStorage.setItem("previewsPlayerTab", "characterData")
                const unbanRequest = await api.unMute(characterData.playerData.UserId);
                console.log("UnMute", unbanRequest)

                if (unbanRequest) {
                    await reloadPlayerData();
                    displayNotification = true;
                    notification = element.alertSuccess(translation.get()["unMuteSucces"]);
                    return init(characterData, userData);
                } else {
                    await reloadPlayerData();
                    displayNotification = true;
                    notification = element.alertError(translation.get()["errorMessageDefault"]);
                    return init(characterData, userData);
                }
            }

            /**
             * Give item to Player
             * @param {*} e 
             * @returns 
             */
            async function giveItem(e, item, quant) {
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
                    console.log(characterData)
                    const giveRequest = await api.giveItem(characterData.playerData.Name, itemId, quantity);
                    console.log(giveRequest);
                    if (giveRequest) {
                        await reloadPlayerData();
                        displayNotification = true;
                        notification = element.alertSuccess(translation.get()["itemGiveSuccess"]);
                        return init(characterData, userData)
                    } else {
                        displayNotification = true;
                        notification = element.alertError(translation.get()["errorMessageDefault"]);
                        return init(characterData, userData)
                    }
                } else {
                    displayNotification = true;
                    notification = element.alertError(translation.get()["errorMessageDefault"]);
                    return init(characterData, userData)
                }
            }

            /**
             * Take Item to Player
             * @param {*} e 
             * @returns 
             */
            async function takeItem(e, item = null, quant = null) {
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
                    const takeRequest = await api.takeItem(characterData.playerData.Name, itemId, quantity);
                    console.log(takeRequest);
                    if (takeRequest) {
                        await reloadPlayerData();
                        displayNotification = true;
                        notification = element.alertSuccess(translation.get()["itemTakeSuccess"]);
                        return init(characterData, userData)
                    } else {
                        displayNotification = true;
                        notification = element.alertError(translation.get()["errorMessageDefault"]);
                        return init(characterData, userData)
                    }
                } else {
                    displayNotification = true;
                    notification = element.alertError(translation.get()["errorMessageDefault"]);
                    return init(characterData, userData)
                }
            }

            async function reloadPlayerData() {
                characterData = await api.getPlayer(characterData.playerData.Id);
                userData = await api.getUser(characterData.playerData.UserId);
            }

            async function kick(e) {
                e.preventDefault();
                localStorage.setItem("previewsPlayerTab", "characterData")
                const kickRequest = await api.kick(characterData.playerData.Name);
                console.log(kickRequest)
                if (kickRequest.hasOwnProperty("Message") && kickRequest.Message != `${characterData.playerData.Name} has been kicked by the server!`) {
                    displayNotification = true;
                    notification = element.alertInfo(kickRequest.Message);
                    return init(characterData, userData)
                } else {
                    if (kickRequest.hasOwnProperty("Message") && kickRequest.Message == `${characterData.playerData.Name} has been kicked by the server!`) {
                        displayNotification = true;
                        notification = element.alertInfo(kickRequest.Message);
                        return init(characterData, userData)
                    } else {
                        displayNotification = true;
                        notification = element.alertError(translation.get()["errorMessageDefault"]);
                        return init(characterData, userData)
                    }

                }
            }

            async function kill(e) {
                e.preventDefault();
                const killRequest = await api.kill(characterData.playerData.Name);
                console.log(killRequest)
                localStorage.setItem("previewsPlayerTab", "characterData")
                if (killRequest.hasOwnProperty("Message") && killRequest.Message != `${characterData.playerData.Name} has been killed!`) {
                    displayNotification = true;
                    notification = element.alertInfo(killRequest.Message);
                    return init(characterData, userData)
                } else {
                    if (killRequest.hasOwnProperty("Message") && killRequest.Message == `${characterData.playerData.Name} has been killed!`) {
                        displayNotification = true;
                        notification = element.alertInfo(killRequest.Message);
                        return init(characterData, userData)
                    } else {
                        displayNotification = true;
                        notification = element.alertError(translation.get()["errorMessageDefault"]);
                        return init(characterData, userData)
                    }

                }
            }

            function empty(data) {
                return data.filter((data) => data.ItemId != "00000000-0000-0000-0000-000000000000");
            }
        });
};

exports.renderPlayer = renderPlayer;