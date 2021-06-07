window.addEventListener("load", () => {

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

    window.addEventListener('click', () => {
        // console.log(event)
        if (event.target == modalalertIndex) {
            modalalertIndex.style.display = "none";
            return;
        }
        if (event.target == modalalert) {
            modalalert.style.display = "none";
            return;
        }
    })
})

