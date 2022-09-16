// Modules to control application life and create native browser window
const { app, BrowserWindow, screen, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const { StorageManager } = require("./Utils/StorageManager");
const { Params } = require("./Utils/Params");
const { ApiManager } = require("./Utils/ApiManager");

const store = new StorageManager();
const api = new ApiManager();
const path = require('path');
let mainWindow = null;
let splashScreen = null;

async function createWindow() {
    let width = null;
    let height = null;


    width = 1000;
    height = 700;

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        webPreferences: {
            preload: path.join(__dirname, 'index.js'),
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true,
            devTools: Params.dev ? true : false,
        },
        autoHideMenuBar: true,
        maximizable: true,
        minimizable: false,
        center: true,
        frame: false,
        title: "Intersect Tools",
        show: false,
        backgroundColor: '#56cc5b10'
    });

    // if (store.storageExist("api_token")) {
    //     if (await api.reloadToken()) {
    //         // and load the index.html of the app.
    //         mainWindow.loadFile('index.html');
    //     } else {
    //         // and load the index.html of the app.
    //         mainWindow.loadFile('index.html');
    //     }
    // } else {
    //     // and load the index.html of the app.
    //     mainWindow.loadFile('index.html');
    // }
            mainWindow.loadFile('index.html');



    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
        mainWindow.center();

        /**
         * Si le language par défaut n'est pas définit
         */
        if (!store.storageExist("language")) {
            // On le set par défaut sur anglais.
            store.setStorage("language", "en");
        }

        /**
         * Si la première visite n'a pas encore été enregistré alors on l'enregistre
         */
        if (!store.storageExist("firstVisit")) {
            store.setStorage("firstVisit", Math.floor(Date.now() / 1000));
        }

        /**
         * Si la première visite existe, alors on set la dernière visite
         */
        if (store.storageExist("firstVisit")) {
            store.setStorage("lastVisit", Math.floor(Date.now() / 1000));
        }

        if (!store.storageExist("allowAnalytic")) {
            store.setStorage("allowAnalytic", true);
        }

        if (Params.dev) {
            // Open the DevTools.
            mainWindow.webContents.openDevTools({ mode: "detach" });
        }
    });
}

function createSplash() {
    let width = null;
    let height = null;


    splashScreen = new BrowserWindow({
        width: 850,
        height: 600,
        webPreferences: {
            devTools: false,
            devTools: Params.dev ? true : false,
            nodeIntegration: true,
            nodeIntegrationInSubFrames: true
        },
        autoHideMenuBar: true,
        maximizable: false,
        show: false,
        minimizable: false,
        center: true,
        frame: false,
        backgroundColor: '#000'
    })

    // and load the index.html of the app.
    splashScreen.loadFile('splash/index.html');

    splashScreen.once('ready-to-show', () => {
        splashScreen.show();
        splashScreen.focus();
        setTimeout(() => {
            createWindow();
            splashScreen.close();
        }, 6000);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    autoUpdater.autoDownload = false;
    autoUpdater.checkForUpdates();
    if (!Params.dev) {
        createWindow();
    } else {
        createWindow();
    }



    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0 && !Params.dev) splashScreen();
        if (BrowserWindow.getAllWindows().length === 0 && !Params.dev) createWindow();

    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

app.on("uncaughtException", (error) => {
    console.log(error)
})

ipcMain.on("reduce_app", (event, arg) => {
    mainWindow.minimize();
});

ipcMain.on("quit_app", (event, arg) => {
    app.quit();
});

ipcMain.on("aboutPages", (event, arg) => {
    mainWindow.setSize(725, 305);
    mainWindow.center();
});
ipcMain.on("backButtonSet", (event, arg) => {
    mainWindow.webContents.send("displayBackButton");
});

ipcMain.on("backButtonRemove", (event, arg) => {
    mainWindow.setSize(1000, 700);
    mainWindow.center();
    mainWindow.webContents.send("hideBackButton");
});

ipcMain.on("beforeRestart", (event, arg) => {
    let options = {
        buttons: ["Yes", "No"],
        message: "Do you really want to quit?"
    }
    let message = dialog.showMessageBox(options, (response, checkboxChecked) => {
        console.log(response)
        console.log(checkboxChecked) //true or false
    })

    message.then(response => {
        console.log(response);

        if (response.response === 0) {
            app.relaunch();
            app.exit()
        }
    })

});

ipcMain.on("reload", (event, arg) => {
    app.relaunch();
    app.exit()
});

ipcMain.on("goTo", (event, arg) => {
    mainWindow.webContents.send("goTo", arg)
})

autoUpdater.on('download-progress', (progressObj) => {
    mainWindow.webContents.send("download-progress", progressObj);
});

autoUpdater.on('update-downloaded', () => {
    mainWindow.webContents.send('update_downloaded');
});

// autoUpdater.on("update-not-available", () => {
//   mainWindow.webContents.send("goTo", "/update")
// });

autoUpdater.on('update-available', () => {
    mainWindow.webContents.send("goTo", "/update");
    mainWindow.webContents.send("update_available");
});

autoUpdater.on("error", (event, args) => {
    mainWindow.webContents.send("restartError", { event, args });
})

ipcMain.on('downloadUpdate', () => {
    autoUpdater.downloadUpdate();
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});

ipcMain.on("checkUpdate", () => {
    autoUpdater.checkForUpdatesAndNotify();
    // autoUpdater.downloadUpdate();
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.