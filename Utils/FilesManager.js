const fs = require('fs');

class FilesManager {
    constructor() {

    }

    read(file) {
        return fs.readFileSync(file, 'utf-8');
    }

    exist(file) {
        return fs.existsSync(file);
    }

    createFolder(file, recursive = true) {
        if (recursive) {
            return fs.mkdirSync(store.getStorage('baseInstallPath'), {
                recursive: true
            });
        } else {
            return fs.mkdirSync(store.getStorage('baseInstallPath'), {
                recursive: false
            });
        }

    }

    createWriteStream(file) {
        return fs.createWriteStream(file);
    }

    writeFile(){}
}

exports.FilesManager = FilesManager;