const { StorageManager } = require("./StorageManager");

class TranslationManager {
    constructor() {
        this.store = new StorageManager();
        this.language = null;
        this.translation = null;
    }

    getTranslation() {
        this.language = this.store.getStorage("language");
        console.log("lang", this.language);
        if (this.language == "fr") {
            this.translation = {
                menuHome:"Accueil",
                menuAccounts:"Comptes",
                menuPlayers:"Joueurs",
                menuAbout:"A propos",
                menuSetting:"Paramètres",
                menuGuilds:"Guildes",
                menuGlobalVariables:"Variables",
                loginTitle:"Connexion",
                loginUsername:"Nom d'utilisateur de votre compte administrateur",
                loginPassword:"Mot de passe de votre compte administrateur",
                installServerIp:"Entrez l'ip du serveur",
                installServerPort:"Entrez le port du serveur",
                installUsername:"Entrez le nom d'utilisateur du compte api",
                installPassword:"Entrez le mot de passe du compte api",
                offlineTitle:"Serveur hors ligne.",
                offlineDesc:"Le serveur de jeu est éteint, veuillez réessayer plus tard.",
                SettingsTitle: "Paramètres de l'application",
                settingChooseLanguage: "Choisir une langue",
                updateTitle: "Mise à jour de l'application",
                updateText: "Une mise à jour est disponible, le téléchargement est en cours.",
                updateInstallButton: "Installer la mise à jour",
                accountsTitle:"Liste des comptes",
                playersTitle:"Liste des joueurs",
                guildsTitle:"Liste des guildes",
                variablesTitle:"Liste des variables",
                wordName:"Nom",
                seeAccount:"Voir le compte",
                seeCharacter:"Voir le personnage",
                seeAccountLog:"Voir les logs du compte",
                seeGuild:"Voir la guilde",
                wordUserId:"Id de l'utilisateur",
                wordBanned:"Banni",
                wordMuted:"Muté",
                wordClass:"Classe",
                wordLevel:"Niveau",
                wordPenalties:"Sanctions",
                wordItems:"Objets",
                wordInventory:"Inventaire",
                wordBank:"Banque",
                wordFolder:"Dossier",
                wordMember:"Membres",
                wordRetry:"Réesayez",
                noFolder:"Aucun dossier",
                itemByPage:"Nombre d'items à afficher par page",
                playerOnline:"Le joueur est en ligne",
                playerOffline:"Le joueur est hors ligne",
                penaltiesDuration:"Durée de la sanction",
                penaltiesReason:"Raison de la sanction",
                giveItem:"Donner l'objet",
                takeItem:"Prendre l'objet",
                labelItemId:"Entrez l'identifiant de l'object",
                labelItemQuantity:"Entrez la quantité de l'objet",
                errorMessageDefault:"Une erreur s'est produite.",
                banSuccess:"Le joueur a été banni avec succès.",
                muteSuccess:"Le joueur a été muté avec succès.",
                unBanSuccess:"Le joueur a été débanni avec succès.",
                unMuteSucces:"Le joueur a été débanni avec succès.",
                itemGiveSuccess:"L'objet a bien été envoyé au joueur.",
                itemTakeSuccess:"L'élément a été supprimé avec succès de l'inventaire du joueur.",
                aMomentAgo:"a moment ago",
                momentAgo:"moments ago",
                secondAgo:" secondes",
                aMinuteAgo:"Il y'a une minute",
                minuteAgo:" minutes",
                anHourAgo:"An hour ago",
                hourAgo:" hours ago",
                aDayAgo:"a day ago",
                dayAgo:" days ago",
                aWeekAgo:"a week ago",
                weekAgo: " weeks ago",
                aMonthAgo:"a month ago", 
                monthAgo:" months ago",
                yearAgo:"more than year ago",
                never:"never"

            }
        }

        if (this.language == "en") {
            this.translation = {
                menuHome:"Home",
                menuAccounts:"Accounts",
                menuPlayers:"Players",
                menuAbout:"About",
                menuSetting:"Settings",
                menuGuilds:"Guilds",
                menuGlobalVariables:"Variables",
                loginTitle:"Login",
                loginUsername:"Username of your administrator account",
                loginPassword:"Password of your administrator account",
                installServerIp:"Enter server ip",
                installServerPort:"Enter server port",
                installUsername:"Enter api account username",
                installPassword:"Enter api account password",
                offlineTitle:"Server offline.",
                offlineDesc:"The game server is down, please try again later.",
                SettingsTitle: "App settings",
                settingChooseLanguage: "Choose a language",
                updateTitle: "App update",
                updateText: "An update is available, the download is in progress.",
                updateInstallButton: "Install the update",
                accountsTitle:"Accounts list",
                guildsTitle:"Guilds list",
                variablesTitle:"Variables list",
                wordName:"Name",
                seeAccount:"See account",
                seeCharacter:"See character",
                seeAccountLog:"See account log",
                seeGuild:"See guild",
                wordUserId:"User Id",
                wordBanned:"Banned",
                wordMuted:"Muted",
                wordClass:"Class",
                wordLevel:"Level",
                wordPenalties:"Penalties",
                wordItems:"Items",
                wordInventory:"Inventory",
                wordBank:"Bank",
                wordFolder:"Folder",
                wordMember:"Members",
                wordRetry:"Retry",
                itemByPage:"Number of items to display per page",
                noFolder:"No folder",
                playerOnline:"Player is online",
                playerOffline:"Player is offline",
                penaltiesDuration:"Duration of the penalties",
                penaltiesReason:"Reason of the penalties",
                giveItem:"Give Item",
                takeItem:"Take Item",
                labelItemId:"Enter the id of the item",
                labelItemQuantity:"Enter the quantity of the item",
                errorMessageDefault:"An error has occurred.",
                banSuccess:"The player has been successfully banned.",
                muteSuccess:"The player has been successfully muted.",
                unBanSuccess:"The player has been successfully unbanned.",
                unMuteSucces:"The player has been successfully unmuted.",
                itemGiveSuccess:"The item has been successfully sent to the player.",
                itemTakeSuccess:"The item has been successfully removed from the player.",
                aMomentAgo:"a moment ago",
                momentAgo:"moments ago",
                secondAgo:" seconds ago",
                aMinuteAgo:"a minute ago",
                minuteAgo:" minutes ago",
                anHourAgo:"An hour ago",
                hourAgo:" hours ago",
                aDayAgo:"a day ago",
                dayAgo:" days ago",
                aWeekAgo:"a week ago",
                weekAgo: " weeks ago",
                aMonthAgo:"a month ago", 
                monthAgo:" months ago",
                yearAgo:"more than year ago",
                never:"never"
            }
        }

        const getAllTranslation = document.querySelectorAll("[data-trans]");

        if (getAllTranslation != null || getAllTranslation != undefined) {
            for (const [key, value] of Object.entries(getAllTranslation)) {
                let dataset = value.dataset.trans;

                for (const [transkey, transvalue] of Object.entries(this.translation)) {
                    if (dataset === transkey) {
                        value.innerHTML = transvalue;
                    }
                }
            }
        }
    }

    get() {
        this.getTranslation();
        return this.translation;
    }

    getActualLanguage(){
        this.language = this.store.getStorage("language");
        return this.language;
    }
}
exports.TranslationManager = TranslationManager;