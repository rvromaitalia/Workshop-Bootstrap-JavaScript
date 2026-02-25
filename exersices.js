/* Ex 1*Write a JavaScript program to display the current day and time in the following 
format. 
mm-dd-yyyy, mm/dd/yyyy or dd-mm-yyyy, dd/mm/yyy*/
/*
const currentDate =  new Date();

//Get date components
const day = currentDate.getDate();
const months = currentDate.getMonth();
const year = currentDate.getFullYear();

//Lets print them out
console.log(`${months}-${day}-${year}`);
console.log(`${months}/${day}/${year}`);

//2. Write a JavaScript program to determine whether a given year is a leap year

/* What is a leap year?
* a years is a leap if it is divisable by 4 but not divisible by 100
OR it si divisble by 400 
*/
/*
function isLeapYear(year){
    if((year%4 == 0 && year%100 != 0) || year%400 ==0)
        return true
    else
        return false;
    }

console.log(`Year ` + year + `is a leap year: ` +  isLeapYear(2025));

//4. Write a JavaScript program to calculate multiplication and division of two 
// numbers (input from the us
*/

let numbers = [1,2,3,4,5,6];
console.log(numbers[2]);

numbers[1] = 10;
console.log(numbers);
numbers.push(10,11);
console.log(numbers);

numbers.forEach((number) => {
    console.log(number);
});

console.log("#################")
let eventNumber = numbers.filter((number)=>number%2 ===0);
console.log(eventNumber);

console.log("#################")
let squaredNumbers = numbers.map((number=>number*number));
console.log(squaredNumbers);

// The first parameter is the index where you want to start making changes.
// The second parameter is the number of elements to remove (in this case, 0 means no removal).
// Subsequent parameters are the elements to add.
fruits.splice(2, 0, "kiwi");

console.log(fruits);
// Output: ['apple', 'banana', 'kiwi', 'orange', 'grape']

let lastIndexOfBanana = fruits.lastIndexOf("banana");
console.log(lastIndexOfBanana); // Output: 1

// Removing 'banana' using splice
let bananaMoved = fruits.toSpliced(lastIndexOfBanana, 1);
console.log(bananaMoved); // Output: ['apple', 'kiwi', 'orange', 'grape']