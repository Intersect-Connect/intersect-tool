class ProviderManager{
    constructor(){

    }

    /**
     * Get the provider
     * @param {*} path 
     */
    get(path){
        let provider = null;
        console.log("App path", path);

        if(path.includes("game-jolt-client")){
            provider = "GameJolt";
        }else{
            provider = "Magework";
        }

        return provider;
    }
}

module.exports = ProviderManager // 👈 Export class