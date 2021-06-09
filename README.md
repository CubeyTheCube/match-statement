# match-statement

A functional and declarative alternative to JavaScript's native switch statement.

Based loosely on Rust's `match` statement.

## Installation
```bash
npm install match-statement
```

Then put this at the top of your file:
```js
import match, { _ } from 'match-statement';
```
or if you are using CommonJS,
```js
const { match, _ } = require('match-statement');
```

The `_` is optional, and its value is simply an underscore.

## Features
- Matching literals, regular expressions
- Pattern matching
- Matching multiple values at the same time

## Examples

This is an elegant way to write a "fizzbuzz" program.
```js
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
// 1
// 2
// Fizz
// 4
// Buzz
// etc
```
`_` denotes "any value".

You can also match regular expressions:
```js
console.log(
  match.regex('Hello world')({
    [/^[a-z\s]+$/i]: 'The string is all letters!',
    [/^\d+$/]: 'The string is all numbers!',
    default: 'The string is a mix of letters, numbers, and other characters!',
  })
);
// The string is all letters!
```

And patterns in objects:
```js
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
// Nice!
```

There are two different syntaxes for this, one has an object passed, like this:
```js
match(5)({
  // cases here
});
```
If you want to match multiple values, you enclose them in double brackets `[[ ]]`, like this:
```js
match(5, 6)({
  [[ 5, _ ]]: 'Yes',
  default: 'No',
});
// Yes
```
The other syntax is like this:
```js
match(5,6)
.case(2,3)(4)
.case(1,6)(6)
.default(0)
.value()
// 0
```
`.execute` can be used in place of `.value` (they do the exact same thing) if it seems applicable. The first syntax can not be used for pattern matching with objects.