const togglePasswordSignIn = document.querySelector('#togglePasswordSignIn');
const passwordSignIn = document.querySelector('#password-signin');

togglePasswordSignIn.addEventListener('click', function (e) {
  // toggle the type attribute
  const type = passwordSignIn.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordSignIn.setAttribute('type', type);
  // toggle the eye slash icon
  this.classList.toggle('fa-eye-slash');
});


