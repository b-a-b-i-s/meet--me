var modalin = document.getElementById("signinmodal");
var btnin = document.getElementById("signinbtn");
var spanin = document.getElementsByClassName("close-sign")[0];
var modalup = document.getElementById("signupmodal");
var linkup = document.getElementById("signuplink");
var spanup = document.getElementsByClassName("close-sign")[1];

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