const clickItems = document.querySelectorAll('.tabs li a');
const clickContents = document.querySelectorAll('.content .form');
const registerBtn = document.querySelector('.registerBtn');
const register = document.querySelector('.register');
const signInBtn = document.querySelector('#signIn');
const signupBtn = document.querySelector('#signup');

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

signupBtn.addEventListener('click', function () {
  send('signup');
});

signInBtn.addEventListener('click', function () {
  send('signIn');
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
      })
      .catch(err => console.log(err));
  };

  fetchPost();

  document.querySelector(`#email_${type}`).value = '';
  document.querySelector(`#password_${type}`).value = '';
  document.querySelector(`#password_repeat`).value = '';
}
