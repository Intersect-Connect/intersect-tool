const { StorageManager } = require("./StorageManager");

class TranslationManager {
    constructor() {
        this.store = new StorageManager();
        this.language = null;
        this.translation = null;
    }

    getTranslation() {
        this.language = this.store.getStorage("language");
        if (this.language == "fr") {
            this.translation = {
                menuHome:"Accueil",
                menuAccounts:"Comptes",
                menuPlayers:"Joueurs",
                menuRank:"Classement",
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
                IntersectConnectLoginTitle: "Me connecter avec Intersect Connect",
                IntersectConnectTitle:"Enregistrer en ligne",
                IntersectConnectSaveInfo:"<p>Enregistrer en ligne, vous permet d'accédez n'importe où à Intersect Tools, pour le moment, il n'est pas encore possible de se connecter à l'initialisation de l'application, cela sera disponible lors de la prochaine mise à jour.</p><p>Cette fonctionnalité permettra d'utiliser la version Android d'Intersect Tools plus facilement.</p><p>Cette procédure sauvegarde en ligne, l'ip, le port de votre serveur de jeu, le nom du compte api ainsi que son mot de passe.</p>",
                IntersectConnectSaveButton:"Enregistrer",
                IntersectConnectServerId: "Votre id serveur est",
                updateTitle: "Mise à jour de l'application",
                updateText: "Une mise à jour est disponible, le téléchargement est en cours.",
                updateInstallButton: "Installer la mise à jour",
                accountsTitle:"Liste des comptes",
                playersTitle:"Liste des joueurs",
                guildsTitle:"Liste des guildes",
                variablesTitle:"Liste des variables",
                RankTitle:"Classement des joueurs",
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
                wordCharacterData:"Informations",
                allowAnalytic:"Autoriser l'analyse de votre utilisation de Intersect Tools",
                analyticTitle:"Données d'analyse",
                analyticDesc:"L'analyse de votre utilisation d'Intersect Tools n'est qu'à titre de statistiques, nous ne récoltons uniquement les routes de l'application ainsi que votre identifiant unique (générer automatiquement par MatomoJS) pour savoir combien de client utilise Intersect Tools. Vous pouvez à tout moment désactiver les services analytiques depuis les paramètres.",
                noFolder:"Aucun dossier",
                supportUs:"Soutenez-nous",
                supportDesc:"Vous pouvez soutenir le développeur de l'application en faisant un don, si vous le souhaitez.",
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
                unMuteSucces:"Le joueur a été démuté avec succès.",
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
                menuRank:"Rank",
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
                IntersectConnectLoginTitle: "Log in with Intersect Connect",
                IntersectConnectTitle:"Register online",
                IntersectConnectSaveInfo:"<p>Register online, allows you to access Intersect Tools anywhere, at the moment it is not yet possible to connect to the initialization of the application, it will be available in the next update.</p><p>This feature will make it easier to use the Android version of Intersect Tools.</p><p>This procedure saves online, the ip, the port of your server game, the name of the api account and its password.</p>",
                IntersectConnectSaveButton:"Save",
                IntersectConnectServerId: "Your server id is ",
                updateTitle: "App update",
                updateText: "An update is available, the download is in progress.",
                updateInstallButton: "Install the update",
                accountsTitle:"Accounts list",
                guildsTitle:"Guilds list",
                variablesTitle:"Variables list",
                RankTitle:"Players Ranking",
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
                wordCharacterData:"Character Data",
                allowAnalytic:"Allow analysis of your use of Intersect Tools",
                analyticTitle:"Analysis data",
                analyticDesc:"The analysis of your use of Intersect Tools is only for statistical purposes, we only collect the routes of the application as well as your unique identifier (generated automatically by MatomoJS) to know how many customers use Intersect Tools. You can deactivate analytical services at any time from the settings.",
                itemByPage:"Number of items to display per page",
                noFolder:"No folder",
                supportUs:"Support Us",
                supportDesc:"You can support the app developer by donating, if you wish.",
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