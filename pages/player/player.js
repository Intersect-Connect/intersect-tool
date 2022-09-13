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

            init(characterData, userData);

            function init(character, user) {
                content.innerHTML = ejs.render(mainHtml, {
                    "characterData": character.playerData,
                    "inventory": character.inventory,
                    "bank": character.bank,
                    "userData": user,
                    "displayNotification": displayNotification,
                    "notification": notification
                });

                const banButton = document.getElementById("banButton")
                const unbanButton = document.getElementById("unbanButton")
                const muteButton = document.getElementById("muteButton");
                const unmuteButton = document.getElementById("unmuteButton");
                const giveButton = document.getElementById("giveButton");
                const takeButton = document.getElementById("takeButton");
                const kickButton = document.getElementById("kickButton");
                const killButton = document.getElementById("killButton");

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

                if(killButton){
                    killButton.addEventListener("click", kill);
                }
                translation.getTranslation();

            }

            /**
             * Ban Player
             * @returns 
             */
            async function ban() {
                const formData = new FormData(document.getElementById("sanctionForm"));

                let duration = formData.get("duration");
                let reason = formData.get("reason");

                if (duration != null && reason != null) {
                    const banRequest = await api.ban(characterData.playerData.Name, duration, reason);
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
                const unbanRequest = await api.unBan(characterData.playerData.Name);
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
                const formData = new FormData(document.getElementById("sanctionForm"));

                let duration = formData.get("duration");
                let reason = formData.get("reason");

                if (duration != null && reason != null) {
                    const banRequest = await api.mute(userData.Id, duration, reason);
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
                const unbanRequest = await api.unMute(characterData.playerData.Name);
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
            async function giveItem(e) {
                e.preventDefault();
                const formData = new FormData(document.getElementById("giveItem"));

                let itemId = formData.get("itemId");
                let quantity = formData.get("quantity");

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
            async function takeItem(e) {
                e.preventDefault();
                const formData = new FormData(document.getElementById("giveItem"));

                let itemId = formData.get("itemId");
                let quantity = formData.get("quantity");
                console.log(characterData)

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
                const kickRequest = await api.kick(characterData.playerData.Name);
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
        });
};

exports.renderPlayer = renderPlayer;