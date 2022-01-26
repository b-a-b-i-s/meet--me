var btnup = document.getElementById("upbtn");


if (btnup) {
    btnup.onclick = function () {
        document.getElementById("signupmodal").style.display = "block";
    }
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


document.querySelector('#copy-btn').onmouseout = outFunc();

if (document.querySelector('#create-bottom-page'))
    document.querySelector('#create-bottom-page').addEventListener('mousedown', logMouseButton);

function logMouseButton(e) {   
    if (typeof e === 'object') {
        switch (e.button) {
        case 0:
            location.href=e.target.dataset.path;
            break;
        case 1:
            window.open(e.target.dataset.path,'_blank');
            break;
        }
    }
}