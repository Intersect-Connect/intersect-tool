const Store = require('electron-store');

class StorageManager {
    constructor() {
        this.store = new Store();
    }

    getStorage(key) {
        return this.store.get(key);
    }

    setStorage(key, value) {
        return this.store.set(key, value);
    }

    removeStorage(key) {
        return this.store.delete(key);
    }

    storageExist(key) {
        if (this.store.has(key)) {
            return true;
        } else {
            return false;
        }
    }
}
exports.StorageManager = StorageManager;