'use strict';

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const moveDes = movements.map((movement, index) =>
//   movement > 0
//     ? console.log(`Deposited ${index + 1} : ${movement}`)
//     : console.log(`Withdraw ${index + 1} : ${Math.abs(movement)}`),
// );

// const deposits = movements.filter(mov => mov > 0);
// const withdraws = movements.filter(mov => mov < 0).map(mov => Math.abs(mov));

// console.log(deposits);
// console.log(withdraws);

// reduce method //
//calculating sum
// const netBalance = (labelBalance.textContent = movements.reduce((acc, cur) => {
//   return acc + cur;
// }));
// console.log(netBalance);
//calculating max
// const maxBalance = movements.reduce((acc, cur) => {
//   return acc > cur ? acc : cur;
// });
// console.log(maxBalance);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const lastBigWithdraw = movements.findLastIndex(mov => Math.abs(mov) > 2000);
console.log(`Your Last big withdraw was ${lastBigWithdraw}`);

/////////////////////////////////////////////////

const julia = [3, 5, 2, 12, 7];
const kate = [4, 1, 15, 8, 3];

const julia2 = [9, 16, 6, 8, 3];
const kate2 = [10, 5, 6, 1, 4];

//Challenge 1

function checkDogs(dogsJulia, dogsKate) {
  //don't mutate function parameters instead create new arrays
  let dogsJuliaCorrect = dogsJulia.slice(1, -2);
  console.log(dogsJuliaCorrect);
  let allDogsAges = dogsJuliaCorrect.concat(dogsKate);
  console.log(allDogsAges);
  //CallBack Function
  allDogsAges.forEach(function (dogsAges, index) {
    dogsAges < 3
      ? console.log(`Dog number ${index + 1} is an puppy`)
      : console.log(`Dog number ${index + 1} is an adult`);
  });
}
checkDogs(julia, kate);
checkDogs(julia2, kate2);

//Challenge 2

const dogAges = [5, 2, 4, 1, 15, 8, 3];

const calcAverageHumanAge = function (ages) {
  const calcAges = ages.map(newAges => {
    return newAges <= 2 ? 2 * newAges : 16 + newAges * 4;
  });
  const adultDogs = calcAges.filter(newDogAge => newDogAge >= 18);
  // 1 mistake( divide outside )
  const avgHumanAge =
    adultDogs.reduce((acc, cur) => acc + cur, 0) / adultDogs.length;
  // forget return i thought it is for each
  return avgHumanAge;
};

console.log(calcAverageHumanAge(dogAges));

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  checkMovements(currentAccount, !sorted);
  sorted = !sorted;
});

// Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

// TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
// TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

const jDogs = [5, 2, 4, 1, 15, 8, 3];

const calcAge = ages => {
  const calculation = ages
    .map(newAges => (newAges <= 2 ? 2 * newAges : 16 + newAges * 4))
    .filter(newDogAge => newDogAge >= 18)
    .reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);
  return calculation;
};

console.log(calcAge(jDogs));

// challenge 4

const breeds = [
  {
    breed: 'German Shepherd',
    averageWeight: 32,
    activities: ['fetch', 'swimming'],
  },
  {
    breed: 'Dalmatian',
    averageWeight: 24,
    activities: ['running', 'fetch', 'agility'],
  },
  {
    breed: 'Labrador',
    averageWeight: 28,
    activities: ['swimming', 'fetch'],
  },
  {
    breed: 'Beagle',
    averageWeight: 12,
    activities: ['digging', 'fetch'],
  },
  {
    breed: 'Husky',
    averageWeight: 26,
    activities: ['running', 'agility', 'swimming'],
  },
  {
    breed: 'Bulldog',
    averageWeight: 36,
    activities: ['sleeping'],
  },
  {
    breed: 'Poodle',
    averageWeight: 18,
    activities: ['agility', 'fetch'],
  },
];

// ANSWERS

const huskyWeight = breeds.find(breed => breed.breed === 'Husky').averageWeight;
console.log(huskyWeight);

const dogBothActivities = breeds.find(
  breed =>
    breed.activities.includes('running') && breed.activities.includes('fetch'),
).breed;
console.log(dogBothActivities);

const allActivities = breeds.flatMap(act => act.activities);
console.log(allActivities);

const uniqueActivities = new Set(allActivities);

const swimmingAdjacent = [
  ...new Set(
    breeds
      .filter(breed => breed.activities.includes('swimming'))
      .flatMap(act => act.activities)
      .filter(rem => rem !== 'swimming'),
  ),
];
console.log(swimmingAdjacent);

const active = breeds.some(act => act.activities.length >= 3);
console.log(active);

const weights = [...breeds];

console.log(weights);

const haviest = Math.max(...breeds.map(w => w.averageWeight));
console.log(haviest);

/// NOTE Pactice

//FIND METHOD
(function () {
  const numbers = [3, 7, 10, 15, 22, 8];

  const greater = numbers.find(num => num > 10);
  console.log(greater);

  const users = [
    { id: 1, name: 'Ali' },
    { id: 2, name: 'Sara' },
    { id: 3, name: 'Omar' },
  ];
  // Find the user with id === 2
  // Then try finding a user with id === 99 (see what you get back)

  const user = users.find(name => name.id === 2).name;
  console.log(user);

  const products = [
    { name: 'Keyboard', inStock: true },
    { name: 'Mouse', inStock: false },
    { name: 'Monitor', inStock: true },
    { name: 'Webcam', inStock: false },
  ];
  // Find the first product that is out of stock
  const outOfStock = products.find(prod => prod.inStock === false);
  console.log(outOfStock);
})();

//GROUP-BY METHOD

(function () {
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  // Expected: { even: [2,4,6,8,10], odd: [1,3,5,7,9] }

  const evenOdd = Object.groupBy(numbers, number => {
    return number % 2 === 0 ? 'Even' : 'Odd';
  });

  console.log(evenOdd);

  const products = [
    { name: 'Apple', category: 'fruit' },
    { name: 'Carrot', category: 'vegetable' },
    { name: 'Banana', category: 'fruit' },
    { name: 'Broccoli', category: 'vegetable' },
    { name: 'Chicken', category: 'meat' },
  ];
  // Expected: { fruit: [Apple, Banana], vegetable: [Carrot, Broccoli], meat: [Chicken] }

  const categories = Object.groupBy(products, product => {
    return product.category;
  });
  console.log(categories);

  const students = [
    { name: 'Ali', score: 85 },
    { name: 'Sara', score: 42 },
    { name: 'Omar', score: 60 },
    { name: 'Lina', score: 30 },
  ];
  // Expected: { pass: [Ali, Omar], fail: [Sara, Lina] }

  const passFail = Object.groupBy(students, marks => {
    return marks.score > 50 ? 'Pass' : 'Fail';
  });
  console.log(passFail);
})();

(function () {
  const numbers = [23, 4, 89, 12, 56, 1, 45];
  // Sort ascending, then sort descending
  // Watch out: sort() mutates the array
  //use toSorted for the second one..so that it returns new array , don't change ascending one
  const asc = numbers.sort((a, b) => a - b);
  const dec = numbers.toSorted((a, b) => b - a);
  console.log(asc);
  console.log(dec);

  //
  const people = [
    { name: 'Zara', age: 25 },
    { name: 'Ali', age: 19 },
    { name: 'Omar', age: 34 },
    { name: 'Lina', age: 22 },
  ];
  // Sort by age ascending, then sort by age descending
  const ascAges = people.sort((a, b) => a.age - b.age);
  console.log(ascAges);
  const decAges = people.toSorted((a, b) => b.age - a.age);
  console.log(decAges);

  //
  const words = ['banana', 'Apple', 'cherry', 'apricot', 'Blueberry'];
  // Sort alphabetically ignoring case
  // Expected: ["Apple", "apricot", "banana", "Blueberry", "cherry"]
  const sortedWords = words.map(arr => arr.toLowerCase()).sort();
  console.log(sortedWords);
})();

(function () {
  //SOME AND EVERY METHOD
  const numbers2 = [4, 8, 15, 16, 23, 42];
  // Check: are ALL numbers even? are ANY numbers even?
  const evan = numbers2.some(evn => evn % 2 === 0);
  console.log(evan);

  const users = [
    { name: 'Ali', age: 22 },
    { name: 'Sara', age: 17 },
    { name: 'Omar', age: 30 },
  ];
  // Check: can this whole group book (everyone 18+)?
  // Check: is there at least one minor in the group?
  const checkAge = users.every(age => age.age >= 18);
  console.log(checkAge);

  const products2 = [
    { name: 'Keyboard', inStock: true },
    { name: 'Mouse', inStock: false },
    { name: 'Monitor', inStock: true },
  ];
  // Check: is EVERYTHING in stock (so the order can ship complete)?
  // Check: is ANYTHING in stock (so the order isn't a total loss)?
  const checkStock = products2.every(stock => stock.inStock);
  console.log(checkStock);
})();

//

const randomDiceRolls = Array.from(
  { length: 100 },
  () => Math.trunc(Math.random() * 6) + 1,
);
console.log(randomDiceRolls);

// challenge 5

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

dogs.forEach(function (dog) {
  dog.recFood = Math.trunc(dog.weight ** 0.75 * 28);
});

console.log(dogs);

const sarah = dogs.find(sa => sa.owners.includes('Sarah'));

console.log(sarah);

const own = dogs.reduce(
  (acc, dog) => {
    if (dog.recFood < dog.curFood) {
      acc.ownerTooMuch.push(...dog.owners);
    } else if (dog.recFood > dog.curFood) {
      acc.ownerTooLittle.push(...dog.owners);
    }
    return acc;
  },
  { ownerTooMuch: [], ownerTooLittle: [] },
);

const { ownerTooMuch, ownerTooLittle } = own;

console.log(ownerTooMuch, ownerTooLittle);

const exact = dogs.some(dog => dog.curFood === dog.recFood);

const okay = dogs.every(dog => dog.curFood === dog.recFood / 10);

console.log(exact);
console.log(okay);

const groups = Object.groupBy(dogs, dog => {
  if (dog.curFood === dog.recFood) return 'exact';
  if (dog.curFood > dog.recFood) return 'too-much';
  if (dog.curFood < dog.recFood) return 'too-little';
});

console.log(groups);

const groups2 = Object.groupBy(dogs, dog => `${dog.owners.length}--owners`);

console.log(groups2);

const sorte = dogs.toSorted((a, b) => a.recFood - b.recFood);

console.log(sorte);

function alternateCase(str) {
  let alternate = '';
  for (let i = 0; i < str.length; i++) {
    if (i % 2 === 0) {
      alternate += str[i].toLowerCase();
    } else {
      alternate += str[i].toUpperCase();
    }
  }
  return alternate;
}

console.log(alternateCase('hello world'));

// const moveUI = Array.from(document.querySelectorAll('.movements__value'), el =>
//   Number(el.textContent.replace('€', '')),
// );

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const depositSum = accounts
  .flatMap(account => account.movements)
  .filter(mov => mov > 0)
  .reduce((sum, cur) => sum + cur);

const depositCount = accounts
  .flatMap(account => account.movements)
  .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

console.log(depositSum);
console.log(depositCount);

//creating new objects through reduce method

// const sumDepWith = accounts
//   .flatMap(account => account.movements)
//   .reduce(
//     (sums, mov) => {
//       if (mov > 0) sums.Deposit += mov;
//       if (mov < 0) sums.Withdraw += Math.abs(mov);
//       return sums;
//     },
//     { Deposit: 0, Withdraw: 0 },
//   );

const { Deposit, Withdraw } = accounts
  .flatMap(account => account.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? 'Deposit' : 'Withdraw'] += cur;
      return sums;
    },
    { Deposit: 0, Withdraw: 0 },
  );

console.log(Deposit, Withdraw);

const covertTitle = function (title) {
  const exceptions = ['a', 'an', 'the', 'but', 'or', 'on', 'in', 'with'];

  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word =>
      exceptions.includes(word)
        ? word
        : word[0].toUpperCase() + word.slice(1).toLowerCase(),
    );
  return titleCase;
};

console.log(covertTitle('this is a nice title'));
