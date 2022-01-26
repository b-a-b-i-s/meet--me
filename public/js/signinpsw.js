const togglePasswordSignIn = document.querySelector('#togglePasswordSignIn');
const passwordSignIn = document.querySelector('#password-signin');

togglePasswordSignIn.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = passwordSignIn.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordSignIn.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});


document.querySelector('#home-ref').addEventListener('mousedown', logMouseButton);
    document.querySelector('#create-ref').addEventListener('mousedown', logMouseButton);

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

