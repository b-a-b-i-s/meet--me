function clearSelection() {
    let sel;
    if ( (sel = document.selection) && sel.empty ) {
        sel.empty();
    } else {
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
        let activeEl = document.activeElement;
        if (activeEl) {
            let tagName = activeEl.nodeName.toLowerCase();
            if ( tagName == "textarea" ||
                    (tagName == "input" && activeEl.type == "text") ) {
                // Collapse the selection to the end
                activeEl.selectionStart = activeEl.selectionEnd;
            }
        }
    }
}
function myFunction() {
  var copyText = document.getElementById("meetme-link");
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copied: " + copyText.value;
  clearSelection() 
}

function outFunc() {
  var tooltip = document.getElementById("myTooltip");
  tooltip.innerHTML = "Copy to clipboard";
}

document.querySelector('#copy-btn').onclick = myFunction();
document.querySelector('#copy-btn').onmouseout = outFunc();


document.querySelector('#close-go-to-mymeetings').addEventListener('mousedown', logMouseButton);

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