import { day01 } from "./01/day01.js";

console.clear();

const day = parseInt(process.argv[2]!);
const part = parseInt(process.argv[3]!);

const DAY_OBJECTS = [day01];

const dayObject = DAY_OBJECTS[day - 1];

if (!dayObject) {
  throw new Error("Could not find day");
}

if (part !== 2) {
  dayObject.part1();
} else {
  dayObject.part2();
}
