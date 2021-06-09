import match, { _ } from 'match-statement';

for (let i = 1; i < 100; i++) {
  console.log(
    match(i % 3, i % 5)({
      [[ 0, 0 ]]: 'FizzBuzz',
      [[ 0, _ ]]: 'Fizz',
      [[ _, 0 ]]: 'Buzz',
      default: i,
    })
  );
}

const str = 'Hello world';

console.log(
  match.regex(str)({
    [/^[a-z\s]+$/i]: 'The string is all letters!',
    [/^\d+$/]: 'The string is all numbers!',
    default: 'The string is a mix of letters, numbers, and other characters!',
  })
);

const res = {
  status: 200, 
  body: {
    everythingWorked: true,
    doILikePizza: true,
  }
};

match.pattern(res)
.case({ status: 200, body: {
  everythingWorked: true,
  doILikePizza: true
}})(() => console.log('Nice!'))
.case({ status: 200, body: {
  everythingWorked: true,
  doILikePizza: false,
}})(() => {
  for (let i = 1; i < 100; i++) {
    console.log('why do you not like pizza');
  }
})
.case({ status: 404 })(() => console.log('Oh no!'))
.default(function cry() {
  console.log('Waaaaah!!!');
})
.execute();