const clickItems = document.querySelectorAll('.tabs li a');
const clickContents = document.querySelectorAll('.content .form');
const registerBtn = document.querySelector('.registerBtn');
const register = document.querySelector('.register');
const signInBtn = document.querySelector('#signIn');
const signupBtn = document.querySelector('#signup');
let emailSuccess = false;
let passwordSuccess = false;
let passwordReSuccess = false;

clickItems.forEach(item => {
  item.addEventListener('click', active);
});

registerBtn.addEventListener('click', function (e) {
  active(e);
  register.classList.add('active');
});

function active(e) {
  clickItems.forEach(item => {
    item.classList.remove('active');
  });
  e.target.classList.add('active');

  const clickP = document.querySelector(`#${e.target.dataset.number}`);

  clickContents.forEach(item => {
    item.classList.add('contentNone');
  });
  clickP.classList.remove('contentNone');
}


function showError(input, msg) {
  let field = input.parentElement;
  field.className = 'field error';
  field.querySelector('.validate_txt').innerHTML = msg;
  field.querySelector('span').innerHTML = `error`;
}

function showSuccess(input) {
  let field = input.parentElement;
  field.className = 'field error';
  field.querySelector('.validate_txt').innerHTML = '';
  field.querySelector('span').innerHTML = `check`;
}

function reset(type) {
  document.querySelectorAll('.person').forEach(function (icon) {
    icon.innerHTML = `person`;   
  });
  document.querySelectorAll('.vpn_key').forEach(function (icon) {
    icon.innerHTML = `vpn_key`;
  });

  document.querySelector(`#email_${type}`).value = '';
  document.querySelector(`#password_${type}`).value = '';
  document.querySelector(`#passwordRe_signup`).value = '';
}

function checkRequired(inputAry) {
  inputAry.forEach(function(input){
    if (input.value === '') {
      showError(input, `${input.placeholder} is required`);
    } else {
      showSuccess(input);
    }
  })
}

function checkEmail(input) {
  const re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  if (!re.test(String(input.value).toLowerCase())) {
    showError(
      input, `Email is not valid`,
    );
    emailSuccess = false;
  } else {
    showSuccess(input);
    emailSuccess = true;
  };
}

function checkLength(inputAry, min, max) {
  inputAry.forEach(function (input) {
    if (input.value.length < min || input.value.length > max) {
      showError(
        input,
        `${input.placeholder} must be ${min} - ${max} characters`,
      );
      if (input.placeholder === 'Password') {
        passwordSuccess = false;
      }
    } else {
      showSuccess(input);
      if (input.placeholder === 'Password') {
        passwordSuccess = true;
      } 
    }
  });
}

function checkPasswords(inputA, inputB) {
  if (inputA.value !== inputB.value) {
    showError(inputB, `Passwords do not match.`);
    passwordReSuccess = false;
  } else if(inputB.value == '' || inputB.value.length < 6){
    checkLength([inputB],6, 12); 
    passwordReSuccess = false;
  }else {
    showSuccess(inputB);
    passwordReSuccess = true;
  }
}


function validate(type){
  let email = document.querySelector(`#email_${type}`);
  let password = document.querySelector(`#password_${type}`);

  if (type === 'signup') {
    let passwordRe = document.querySelector(`#passwordRe_${type}`);
    checkRequired([email, password, passwordRe]);
    checkEmail(email);
    checkLength([password, passwordRe], 6, 12);
    checkPasswords(password, passwordRe);
    if (passwordSuccess && passwordReSuccess && emailSuccess) {
      send(type);
    }
  } else {
    checkRequired([email, password]);
    checkLength([password], 6, 12);
    checkEmail(email);
    if (passwordSuccess && emailSuccess) {
      send(type);
    }
  }

};

signupBtn.addEventListener('click', function (e) {
  e.preventDefault();
  validate('signup');
});

signInBtn.addEventListener('click', function (e) {
  e.preventDefault();
  validate('signIn');
});

function send(type) {
  let url = `https://hexschool-tutorial.herokuapp.com/api/${type}`;
  let user = {
    email: document.querySelector(`#email_${type}`).value,
    password: document.querySelector(`#password_${type}`).value,
  };

    // axios 寫法
    const axiosPost = function () {
      axios
        .post(url, user)
        .then(res => {
          console.log(res);
          swal({
            title: res.data.message,
          });
          reset(type);
        })
        .catch(err => {
          console.log(err);
          swal({
            title: err,
          });
        });
    };

  // xhr 寫法
  const xhrPost = function () {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send(JSON.stringify(user));
    xhr.onload = function () {
      const res = JSON.parse(xhr.response);
      swal({
        title: res.message,
      });
      reset(type);
    };
  };

  // fetch 寫法

  const fetchPost = function () {
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(response => response.json())
      .then(data => {
        swal({
          title: data.message,
        });
        reset(type);
      })
      .catch(err => console.log(err));
  };

  fetchPost();
  
}
