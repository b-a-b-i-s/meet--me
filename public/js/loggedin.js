document.querySelector('#home-ref').addEventListener('mousedown', logMouseButton);
document.querySelector('#create-ref').addEventListener('mousedown', logMouseButton);
document.querySelector('#mymeetings-ref').addEventListener('mousedown', logMouseButton);
document.querySelector('#logout').addEventListener('mousedown', logMouseButton);
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