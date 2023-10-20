class RankController {
    constructor(content, libs, controllerData) {
        this.content = content;
        this.libs = libs;
        this.controllerData = controllerData;
    }

    async render() {
        return fetch("./pages/rank/rank.ejs")
            .then((response) => response.text())
            .then(async (mainHtml) => {
                this.init(mainHtml);
            });
    };

    init(mainHtml) {
        this.content.innerHTML = this.libs.ejs.render(mainHtml, {
            "players": this.controllerData.players.Values,
        });
        this.libs.translate.getTranslation();
    }
}

exports.RankController = RankController;