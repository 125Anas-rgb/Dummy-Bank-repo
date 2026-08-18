'use strict';

//for reset pin...getting token and email from backend..

//if it gets reset token then show reset page
//means when user click the reset link..it will open html page...and at that time the script will get reset token so it directly opens reset page only

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDay = document.querySelector('.balance__date');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');
const signUp = document.querySelector('.sign-up');
const labelAcc = document.querySelector('.dont');
const logo = document.querySelector('.logo');
const nav = document.querySelector('nav');
const forgot = document.querySelector('.forgot');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnSignup = document.querySelector('.create');
const createAcc = document.querySelector('.signup__btn');
const btnForgetPin = document.querySelector('.forgot-btn');
const btnNewEmail = document.querySelector('.newEmail-btn');
const btnNewPin = document.querySelector('.newPin-btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputSignupName = document.querySelector('.signup__input--user');
const inputSignupPin = document.querySelector('.signup__input--pin');
const inputSignupEmail = document.querySelector('.signup__input--email');
const inputforgotEmail = document.querySelector('.newEmail');
const inputNewPin = document.querySelector('.newPin');

// Read the values from the URL after the ?. includes only after ? (makes it easy to read)
const params = new URLSearchParams(window.location.search);

//extract the actual params from the link
const resetToken = params.get('resetToken');
const email = params.get('email');

const resetPage = document.querySelector('.reset-page');
const forgetPage = document.querySelector('.forgot-page');

//if resetToken exists and is valid that was sent with the link then enable user to type new pin
if (resetToken) {
  resetPage.classList.remove('hidden');
  nav.classList.add('hidden');
  forgetPage.classList.add('hidden');
  btnSignup.classList.add('hidden');
  labelAcc.classList.add('hidden');
}

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//creating function to accurately calcultae date for each movement
function formatDate(date, locale) {
  //function to calc the days passed
  const calcDayPaas = (date1, date2) => {
    return Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  };
  const dayPassed = calcDayPaas(new Date(), date);

  //checking
  if (dayPassed === 0) return 'Today';
  if (dayPassed === 1) return 'Yesterday';
  if (dayPassed <= 7) return `${dayPassed} days ago`;

  //else returning date
  return new Intl.DateTimeFormat(locale).format(date);
}

function formatNum(value, locale, currency) {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(value);
}

let logoutTimer = function () {
  let tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = 'Log in to get started';
      nav.classList.remove('active');
      containerApp.style.opacity = 0;
      btnSignup.classList.remove('hidden');
    }
    time--;
  };

  let time = 120;

  tick();

  timer = setInterval(tick, 1000);
  return timer;
};

//brining whole transaction / movement row for specific account
function checkMovements(acc, sort = false) {
  //creating mov + dates object to sort together from movements array to movements array + dates array

  const combineDates = acc.movements.map((mov, i) => ({
    //for movements array
    movement: mov,
    //for dates array at each movement index
    mDate: acc.movementsDates.at(i),
  }));
  console.log(combineDates);

  if (sort) {
    containerMovements.innerHTML = '';
    combineDates.sort((a, b) => a.movement - b.movement);
  }
  //sort
  containerMovements.innerHTML = '';
  //running through each movement and date
  combineDates.forEach(function (obj, i) {
    //destructuring obj into 2 ariables for mov and date
    const { movement, mDate } = obj;
    console.log(mDate);

    const mov = movement > 0 ? 'deposit' : 'withdrawal';

    // getting date for each index
    const date = new Date(mDate);

    //calculating accurately using function
    const displayDate = formatDate(date, acc.locale);

    const displayNum = formatNum(movement, acc.locale, acc.currency);

    //getting date

    const htmlContent = `
          <div class="movements__row">
            <div class="movements__type movements__type--${mov}">${i + 1} ${mov}</div>
            <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${displayNum}</div>
        </div>
        `;

    containerMovements.insertAdjacentHTML('afterbegin', htmlContent);
  });
}

//TODO
const eurToUsd = 1.2;
const eurToPkr = 316;
const eurToLra = 54;

function calcDisplayBalance(acc) {
  //new object key
  acc.balance = acc.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  labelBalance.textContent = formatNum(
    currentAccount.balance,
    currentAccount.locale,
    currentAccount.currency,
  );
}

//updating withdraws , deposits and interests from movements
function record(acc) {
  const inserted = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = formatNum(inserted, acc.locale, acc.currency);
  const ejected = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => Math.abs(acc + mov, 0));
  if (acc.movements === 0) labelSumOut.textContent = 0;
  labelSumOut.textContent = formatNum(ejected, acc.locale, acc.currency);
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * acc.interestRate) / 100)
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = formatNum(interest, acc.locale, acc.currency);
}

//main update ui function that updates movements, balance and calculation
function updateUI(acc) {
  //updating movements function
  checkMovements(acc);

  //updating balance function
  calcDisplayBalance(acc);

  //calculating values function
  record(acc);
}

//main account array that we will access in login
let currentAccount;
let timer;

//Event Listeners

btnSignup.addEventListener('click', () => {
  signUp.classList.remove('hidden');
  nav.classList.add('hidden');
  btnSignup.classList.add('hidden');
});

//creating new div wihtin js
const popUp = function (msg) {
  const message = document.createElement('div');
  message.classList.add('msg');
  message.innerHTML = msg;
  document.documentElement.prepend(message);
  setTimeout(function () {
    message.remove();
  }, 5000);
};

createAcc.addEventListener('click', function (e) {
  e.preventDefault();

  fetch('http://localhost:3000/api/signup', {
    //
    method: 'POST',
    //tells that the body will be in json format
    headers: {
      'Content-Type': 'application/json',
    },

    //converting into json(req.body in server)
    //so it can travel thorugh HTTP
    body: JSON.stringify({
      email: inputSignupEmail.value,
      owner: inputSignupName.value,
      pin: Number(inputSignupPin.value),
    }),
  })
    //then says when above opearion fenishes , run this code
    //res is response from server it contains the info
    //async forces function to create promise(faster exexution of data)
    //await pauses execution until promise resolves
    .then(async res => {
      //converts response into js object
      const data = await res.json();

      //checks weather request was successful (done in validateSignup middleware)
      if (!res.ok) {
        popUp(`<p>${data.error}</p>`);
        return;
      }

      if (res.ok) {
        popUp(`<p>A verification link has been sent to email</p>`);
        labelAcc.textContent = `Congrats Your User Name is ${data.username}`;
        signUp.classList.add('hidden');
        nav.classList.remove('hidden');
      }
    });
});

btnForgetPin.addEventListener('click', function (e) {
  e.preventDefault();
  forgetPage.classList.remove('hidden');
  nav.classList.add('hidden');
  createAcc.classList.add('hidden');
  labelAcc.classList.add('hidden');
  btnSignup.classList.add('hidden');
});

//clicks sent reset email button
btnNewEmail.addEventListener('click', function (e) {
  e.preventDefault();

  //fetches api of forget pin request (that will send reset link for pin in email )
  fetch('http://localhost:3000/api/forgetPin', {
    //
    method: 'POST',
    //tells that the body will be in json format
    headers: {
      'Content-Type': 'application/json',
    },

    //converts the types email into json format
    body: JSON.stringify({
      //will send this email to backend so that it verifies
      email: inputforgotEmail.value,
    }),
  }).then(async res => {
    //converts response into js object(data)
    const data = await res.json();

    //checks weather request was successful (done in forgetPin route)
    if (!res.ok) {
      popUp(`<p>${data.error}</p>`);
      return;
    } else {
      popUp(`<p>${data.message}</p>`);

      nav.classList.remove('hidden');
      createAcc.classList.remove('hidden');
      labelAcc.classList.remove('hidden');
      btnSignup.classList.remove('hidden');
      forgetPage.classList.add('hidden');
    }
  });
});

btnNewPin.addEventListener('click', function (e) {
  e.preventDefault();

  fetch('http://localhost:3000/api/resetPin', {
    //
    method: 'POST',
    //tells that the body will be in json format
    headers: {
      'Content-Type': 'application/json',
    },

    body: JSON.stringify({
      //gets values from frontend and backend
      token: resetToken,
      newPin: inputNewPin.value,
    }),
  }).then(async res => {
    //converts response into js object
    const data = await res.json();

    //checks weather request was successful (done in validateSignup middleware)
    if (!res.ok) {
      popUp(`<p>${data.error}</p>`);
      return;
    }

    alert(data.message);

    nav.classList.remove('hidden');
    resetPage.classList.add('hidden');
    btnSignup.classList.remove('hidden');
  });
});

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  //checks if username exists
  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    //tells that the body will be in json format
    headers: {
      'Content-Type': 'application/json',
    },

    //converting into json(req.body in server)
    body: JSON.stringify({
      username: inputLoginUsername.value,
      pin: Number(inputLoginPin.value),
    }),
  }).then(async res => {
    const data = await res.json();

    //checks weather request was successful (done in validateLogin middleware)
    if (!res.ok) {
      popUp(`<p>${data.error}</p>`);
      return;
    }

    if (res.ok) {
      localStorage.setItem('token', data.token);
      currentAccount = data.currentAccount;
      console.log(currentAccount);
      labelAcc.classList.add('hidden');
      btnSignup.classList.add('hidden');
      forgot.classList.add('hidden');

      labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
      nav.classList.add('active');
      containerApp.style.opacity = '1';

      inputLoginUsername.value = '';
      inputLoginPin.value = '';
      calcDisplayBalance(currentAccount);

      //setting now date and time
      //date with spescification in options
      const now = new Date();
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        weekday: 'long',
      };
      const date = Intl.DateTimeFormat(currentAccount.locale, options).format(
        now,
      );
      labelDay.textContent = `As of ${date}`;

      if (timer) clearInterval(timer);
      timer = logoutTimer();

      updateUI(currentAccount);
    }
  });
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');

  fetch('http://localhost:3000/api/transfer', {
    method: 'POST',
    //tells that the body will be in json format
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      senderUsername: currentAccount.username,
      receiveUsername: inputTransferTo.value,
      amount: Number(inputTransferAmount.value),
    }),
  }).then(async res => {
    const data = await res.json();
    currentAccount = data;

    //if all condidtions from validate transfer are correct
    if (res.ok) {
      //movements rows
      updateUI(currentAccount);
      if (timer) clearInterval(timer);
      timer = logoutTimer();
    }
  });
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');

  fetch('http://localhost:3000/api/loan', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      username: currentAccount.username,
      amount: Number(inputLoanAmount.value),
    }),
  }).then(async res => {
    const data = await res.json();
    currentAccount = data;
    //condition to check for loan
    if (res.ok) {
      updateUI(currentAccount);
      if (timer) clearInterval(timer);
      timer = logoutTimer();
    }
  });
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  const token = localStorage.getItem('token');

  fetch('http://localhost:3000/api/closeAcc', {
    method: 'POST',
    //tells that the body will be in json format
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },

    body: JSON.stringify({
      email: inputCloseUsername.value,
      pin: Number(inputClosePin.value),
    }),
  }).then(async res => {
    const data = await res.json();

    if (!res.ok) {
      popUp(`<p>${data.error}</p>`);
      return;
    }
    if (res.ok) {
      containerApp.style.opacity = '0';
      nav.classList.remove('active');
      popUp(`<p>Check your email to confirm closing your account</p>`);
      labelWelcome.textContent = 'Login to Get Started';
      createAcc.classList.remove('hidden');
      labelAcc.classList.remove('hidden');
      btnSignup.classList.remove('hidden');
      forgot.classList.remove('hidden');
    }
  });
});

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((mov, i) => {
    if (i % 2 === 0) mov.style.backgroundColor = 'Blue';
    else mov.style.backgroundColor = 'Green';
  });
});

//Additional Features

function changeTheme() {
  document.querySelector('body').classList.toggle('blackTheme');
  document.querySelectorAll('p').classList.toggle('blackTheme');
  containerMovements.style.backgroundColor = 'rgba(255, 255, 255, 0.4);';
}
logo.addEventListener('click', changeTheme);

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  sorted = !sorted;
  checkMovements(currentAccount, sorted);
});
