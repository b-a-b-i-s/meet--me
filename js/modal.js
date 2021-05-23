const modalin = document.getElementById("signinmodal");
const btnin = document.getElementById("signinbtn");
const spanin = document.getElementsByClassName("close-sign")[0];
const modalup = document.getElementById("signupmodal");
const linkup = document.getElementById("signuplink");
const spanup = document.getElementsByClassName("close-sign")[1];

btnin.onclick = function () {
    modalin.style.display = "block";
}
spanin.onclick = function () {
    modalin.style.display = "none";
}

linkup.onclick = function () {
    modalup.style.display = "block";
}

spanup.onclick = function () {
    modalup.style.display = "none";
}
window.onclick = function (event) {
    // console.log(event)
    if (event.target == modalin) {
        modalin.style.display = "none";
    }
    if (event.target == modalup) {
        modalup.style.display = "none";
    }
}