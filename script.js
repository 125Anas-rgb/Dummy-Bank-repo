'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2026-07-27T17:01:17.194Z',
    '2026-07-18T23:36:17.929Z',
    '2026-07-19T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  currency: 'TRY',
  locale: 'tr-TR',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  currency: 'PKR',
  locale: 'ur-PK',
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
};

const accounts = [account1, account2, account3, account4];

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

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');
const btnSignup = document.querySelector('.create');
const createAcc = document.querySelector('.signup__btn');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');
const inputSignupName = document.querySelector('.signup__input--user');
const inputSignupPin = document.querySelector('.signup__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//adding new property in accounts object

const createUsername = function (accounts) {
  accounts.forEach(function (account) {
    //applying string methods to manipulate the name string into username
    //adding new username property to object
    account.userName = account.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsername(accounts);

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

//updating balance from movements

function calcDisplayBalance(acc) {
  //new object key
  currentAccount.balance = acc.movements.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  labelBalance.textContent = formatNum(
    currentAccount.balance,
    acc.locale,
    acc.currency,
  );
}

const eurToUsd = 1.2;

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

//accessing specific account (login)

//main account array that we will access in login
let currentAccount;
let receiveAcc;
let timer;
//

btnSignup.addEventListener('click', () => {
  signUp.classList.remove('hidden');
  nav.classList.add('hidden');
  btnSignup.classList.add('hidden');
});

createAcc.addEventListener('click', function (e) {
  e.preventDefault();
  const message = document.createElement('div');

  if (inputSignupName.value === '' && inputSignupPin.value === '') {
    message.classList.add('msg');
    message.innerHTML = '<p>Please fill the credentials</p>';
    document.documentElement.prepend(message);
    setTimeout(function () {
      message.remove();
    }, 5000);
  } else {
    signUp.classList.add('hidden');
    nav.classList.remove('hidden');

    function createAccount(name, pin) {
      this.owner = name;
      this.movements = [500, 500, 500];
      this.interestRate = 1.2;
      this.pin = Number(pin);
    }

    const newUser = new createAccount(
      inputSignupName.value,
      inputSignupPin.value,
    );

    accounts.push(newUser);
    createUsername([newUser]);
    console.log(accounts);

    labelAcc.textContent = `Congrats Your User Name is ${newUser.userName}`;
  }
});

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  //checks if username exists
  currentAccount = accounts.find(
    acc => acc.userName === inputLoginUsername.value,
  );
  //then if it exists..it checks for pin
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // successful login
    labelAcc.classList.add('hidden');
    btnSignup.classList.add('hidden');

    labelWelcome.textContent = `Welcome ${currentAccount.owner.split(' ')[0]}`;
    nav.classList.add('active');
    containerApp.style.opacity = '1';

    inputLoginUsername.value = '';
    inputLoginPin.value = '';

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
    //live clock...

    let timee = setInterval(() => {
      const now = new Date();
      const hour = `${now.getHours()}`.padStart(2, 0);
      const minute = `${now.getMinutes()}`.padStart(2, 0);
      const second = `${now.getSeconds()}`.padStart(2, 0);
      const timeee = `${hour}:${minute}:${second}`;

      //updating every second the textcontent also..
      labelDate.textContent = `${timeee}`;
    }, 1000);

    if (timer) clearInterval(timer);
    timer = logoutTimer();

    updateUI(currentAccount);
  } else {
    // account not found OR wrong pin
    labelAcc.classList.remove('hidden');
    labelAcc.textContent = !currentAccount ? 'Account not found' : 'Wrong PIN';
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  //takes value from user
  const amount = Number(inputTransferAmount.value);

  //to the account
  receiveAcc = accounts.find(acc => acc.userName === inputTransferTo.value);

  //conditions to check for sending
  if (
    amount > 0 &&
    receiveAcc &&
    currentAccount.balance >= amount &&
    receiveAcc?.userName !== currentAccount.userName
  ) {
    currentAccount.movements.push(-amount);
    receiveAcc.movements.push(amount);

    currentAccount.movementsDates.push(new Date().toISOString());
    receiveAcc.movementsDates.push(new Date().toISOString());
    //movements rows
    updateUI(currentAccount);
    if (timer) clearInterval(timer);
    timer = logoutTimer();
  }
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  //takes user value
  const amount = Number(Math.round(inputLoanAmount.value));

  //condition to check for loan
  if (amount > 0 && currentAccount.movements.some(mov => mov > amount / 10)) {
    setTimeout(function () {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      updateUI(currentAccount);
    }, 5000);
    if (timer) clearInterval(timer);
    timer = logoutTimer();
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  //checks if credentials are correct
  if (
    currentAccount.userName === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    //find index of current account
    const index = accounts.findIndex(
      acc => acc.userName === currentAccount.userName,
    );
    //remove account from accounts array by index
    accounts.splice(index, 1);
    inputCloseUsername = inputClosePin = '';
    containerApp.style.opacity = '0';
    console.log(accounts);
    nav.classList.remove('active');
  }
});

const movts = Object.groupBy(accounts, account => {
  const activity = account.movements.length;
  if (activity < 3) return 'less active';
  if (activity < 6) return 'normal active';
  if (activity < 9) return 'more active';
});

console.log(movts);

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach((mov, i) => {
    if (i % 2 === 0) mov.style.backgroundColor = 'Blue';
    else mov.style.backgroundColor = 'Green';
  });
});

function changeTheme() {
  document.querySelector('body').classList.toggle('blackTheme');
  document.querySelectorAll('p').classList.toggle('blackTheme');
  containerMovements.style.backgroundColor = 'rgba(255, 255, 255, 0.4);';
}
logo.addEventListener('click', changeTheme);
