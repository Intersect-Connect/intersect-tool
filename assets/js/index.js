window.addEventListener('DOMContentLoaded', () => {
    // // On initialise le tout
    // let swiper = null;
    // let serverOnline = false;
    // let onlineVersion = null;
    // let onlineVersionNumber = null;

    // const serverStatus = document.querySelector("#serverStatus");
    // const gameVersion = document.querySelector("#gameVersion");


    // init();


    // function init() {
    //     // Début du slider
    //     swiper = new Swiper('.swiper-container', {
    //         // Optional parameters
    //         direction: 'horizontal',
    //         loop: true,

    //         // If we need pagination
    //         pagination: {
    //             el: '.swiper-pagination',
    //         },

    //         // Navigation arrows
    //         navigation: {
    //             nextEl: '.swiper-button-next',
    //             prevEl: '.swiper-button-prev',
    //         },
    //         breakpoints: {
    //             // when window width is >= 320px
    //             320: {
    //                 slidesPerView: 2,
    //                 spaceBetween: 20
    //             },
    //             // when window width is >= 480px
    //             480: {
    //                 slidesPerView: 3,
    //                 spaceBetween: 30
    //             },
    //             // when window width is >= 640px
    //             640: {
    //                 slidesPerView: 2,
    //                 spaceBetween: 40
    //             }
    //         }
    //     });
    //     // Fin du slider

    //     // Récupération des informations du jeu depuis le site web
    //     fetch('http://rpgjs.teste/')
    //         .then((response) => {
    //             return response.json()
    //         })
    //         .then((data) => {
    //             if(data.success){
    //                 console.log(data)
    //                 // On set le status du serveur
    //                 serverOnline = data.serverStatus;
    //                 // On set le numéro de version
    //                 onlineVersion = data.gameVersion;
    //                 // On set le nombre de version
    //                 onlineVersionNumber = data.gameNumberVersion;

    //                 if(serverOnline){
    //                     serverStatus.innerHTML = "Serveur en ligne";
    //                     serverStatus.classList.add("is-success");
    //                     serverStatus.classList.remove("is-danger");
    //                 }else{
    //                     serverStatus.innerHTML = "Serveur hors ligne";
    //                     serverStatus.classList.remove("is-success");
    //                     serverStatus.classList.add("is-danger");
    //                 }

    //                 if(gameVersion){
    //                     gameVersion.innerHTML = `Version du jeu ${onlineVersion}`;
    //                 }
    //                 console.log(checkIfExist("./resources/game/"))

    //                 if(fs.existsSync("./resources/game/")){
    //                     console.log("Dossier existe")
    //                 }else{
    //                     console.log("Dossier existe pas")
    //                 }

    //                 console.log(fs.existsSync(path))


    //             }
    //         })
    //         .catch((err) => {
    //             // Do something for an error here
    //         })
    // }

      // Début du slider
       const swiper = new Swiper('.swiper-container', {
            // Optional parameters
            direction: 'horizontal',
            loop: true,

            // If we need pagination
            pagination: {
                el: '.swiper-pagination',
            },

            // Navigation arrows
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                // when window width is >= 320px
                320: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                    loop: true
                },
                // when window width is >= 480px
                480: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                    loop: true
                },
                // when window width is >= 640px
                640: {
                    slidesPerView: 2,
                    spaceBetween: 40,
                    loop: true
                }
            }
        });
        // Fin du slider
});