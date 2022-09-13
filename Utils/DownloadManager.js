const fs = require('fs');
const http = require('https');
const {StorageManager} = require('./StorageManager');
const { launcherVersion, devMode, steamMode, allowChangeInstallPath, includeFiles, getConfig, getLang } = require('../Utils');
const onezip = require('onezip');

class DownloadManager {
    constructor() {
        this.store = new StorageManager();
    }

    test() {
        console.log('fs', fs.existsSync('./src/Utils/DownloadManager.js'))
        return 'Test Success';
    }

    download(file_url, targetPath, kickstart = false) {
        // On initialise les variable pour connaitre le taux de téléchargement.
        console.log('Url', file_url)
        console.log('TargetPath', targetPath)

        let received_bytes = 0;
        let total_bytes = 0;
        let out = null;
        let total_size = 0;
        if (targetPath.includes('resources/app.asar/')) {
            targetPath = targetPath.replace("resources/app.asar/", "");
        }

        if (kickstart) {
            out = fs.createWriteStream(targetPath + 'kickstart.zip');

        } else {
            out = fs.createWriteStream(targetPath + '/' + downloadVersion + '.zip');
        }
        console.log('out', out)

        let req = http.get(file_url, (req) => {
            req.pipe(out);
            total_bytes = parseInt(req.headers['content-length']);
            total_size = this.formatBytes(parseInt(req.headers['content-length']));
            console.log(req)
            console.log(file_url)

            // If request code is 200 all is good
            console.info(`Download start`);

            req.on('response', function (data) {
                // Change the total bytes value to get progress later.
                total_bytes = parseInt(data.headers['content-length']);
            });

            req.on('data', (chunk) => {
                console.log(chunk)
                // Update the received bytes
                received_bytes += chunk.length;

                // console.log(received_bytes, total_bytes)
                // console.log(total_bytes / (Date.now() - startTime)) //bytes/second)
                let percentage = (100.0 * received_bytes / total_bytes).toFixed(2);
                //   element.innerHTML = `${this.downloadInProgress} (${percentage}%)`;
                document.querySelector('.progress').style = `width:${percentage}%`
                document.querySelector('.progress').innerHTML = `${percentage}%`
                if (!kickstart) {
                    document.querySelector('#downloadText').innerHTML = `V${downloadVersion} | ${getLang().downloadInProgress} (${percentage}%) | 
                ${this.formatBytes(parseInt(received_bytes))}/${total_size}`;
                } else {
                    document.querySelector('#downloadText').innerHTML = `Download of Kickstart Package | ${getLang().downloadInProgress} (${percentage}%) | 
                ${this.formatBytes(parseInt(received_bytes))}/${total_size}`;
                }

            });

            req.on('error', (e) => {
                console.log(e)
            })

            req.on('end', () => {

                console.log('Download end.')
                if (kickstart) {
                    this.extractZip(targetPath + 'kickstart.zip', targetPath, true)
                } else {
                    if (!this.store.storageExist('baseInstallPath') && !this.store.getStorage('allowChangeInstallationPath')) {
                        this.extractZip(targetPath + "/" + downloadVersion + '.zip', targetPath)
                    } else {
                        this.extractZip(targetPath + "/" + downloadVersion + '.zip', targetPath)
                    }
                }

            });
        });

        // End function
    }

    extractZip(file_name, targetPath, kickstart = false) {
        console.log('Filename', file_name)
        console.log('targetPath', targetPath)

        const extract = onezip.extract(file_name, targetPath);
        // extract.on('file', (name) => {
        //     console.log(name);
        // });

        extract.on('start', (percent) => {
            console.log('extracting started');
        });

        extract.on('progress', (percent) => {
            downloadText.innerHTML = `${getLang().extractInProgress} (${percent}%)`;
            console.log(percent + '%');
        });

        extract.on('error', (error) => {
            console.error(error);
        });

        extract.on('end', () => {
            console.log('done');
            downloadText.innerHTML = `Completing the extraction...`;
            if (!kickstart) {
                //   Téléchargement fini
                let json = null;

                if (downloadVersion === 1) {
                    json = {
                        "version": onlineVersion,
                        "number": onlineVersionNumber
                    };
                } else {
                    json = {
                        "version": onlineVersion,
                        "number": downloadVersion
                    };
                }

                let data = JSON.stringify(json);

                fs.writeFile(this.store.getStorage('userDataPathConfig') + 'version.json', data, (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        downloadText.innerHTML = "Check for update...";

                        let getVersionJson = fs.readFileSync(this.store.getStorage('userDataPathConfig') + 'version.json');
                        localVersionNumber = JSON.parse(getVersionJson).number;
                        localVersion = JSON.parse(getVersionJson).version;
                        checkUpdate();
                    }
                });
            } else {
                checkUpdate();
            }
        });
    }

    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

// module.exports = DownloadManager;
// module.exports = DownloadManager;
exports.DownloadManager = DownloadManager;