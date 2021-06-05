var btnup = document.getElementById("upbtn");



btnup.onclick = function () {
    document.getElementById("signupmodal").style.display = "block";
}




// document.querySelector("html").style.backgroundColor = "#d2e6a5"

const mediaQuery = window.matchMedia('(max-width: 1000px)')

function handleDeviceChange(e) {
    if (e.matches) {
        document.querySelector("html").style.backgroundColor = "#d2e6a5"
        document.body.style.backgroundColor = "#ecd7c0"
    }
}


mediaQuery.addEventListener('change', handleDeviceChange)
handleDeviceChange(mediaQuery)