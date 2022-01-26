window.addEventListener("load", () => {
    const modalin = document.getElementById("signinmodal");
    const btnin = document.getElementById("signinbtn");
    const spanin = document.getElementsByClassName("close-sign")[0];
    const modalup = document.getElementById("signupmodal");
    const linkup = document.getElementById("signuplink");
    const spanup = document.getElementsByClassName("close-sign")[1];


    const modalalertIndex = document.querySelector("#alert-modal-index");

    if (modalalertIndex) {
        const alertbtnclose = document.querySelector("#close-sign-alert-index");
        alertbtnclose.onclick = () => {
            modalalertIndex.style.display = "none";
        }
        const alertbtnok = document.querySelector("#alert-btn-index");
        alertbtnok.onclick = () => {
            modalalertIndex.style.display = "none";
        }
    }

    const modalalert = document.querySelector("#alert-modal");

    if (modalalert) {
        const alertbtnclose = document.querySelector(".close-sign-alert");
        alertbtnclose.onclick = () => {
            modalalert.style.display = "none";
        }
        const alertbtnok = document.querySelector("#alert-btn");
        alertbtnok.onclick = () => {
            modalalert.style.display = "none";
        }
    }

    if (btnin)
        btnin.onclick = function () {
            modalin.style.display = "block";
        }
    
    if (spanin)
    spanin.onclick = function () {
        modalin.style.display = "none";
    }

    if (modalup)
    linkup.onclick = function () {
        modalup.style.display = "block";
    }

    if (spanup)
    spanup.onclick = function () {
        modalup.style.display = "none";
    }
    
    window.addEventListener('click', (event) => {
        // console.log(event)
        if (event.target == modalalertIndex) {
            modalalertIndex.style.display = "none";
            return;
        }
        if (event.target == modalalert) {
            modalalert.style.display = "none";
            return;
        }
        if (event.target == modalin) {
            modalin.style.display = "none";
        }
        if (event.target == modalup) {
            modalup.style.display = "none";
        }
    })
})

