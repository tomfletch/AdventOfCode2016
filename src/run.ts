import { day01 } from "./01/day01.js"
import { day02 } from "./02/day02.js"
import { day03 } from "./03/day03.js"

console.clear()

const day = parseInt(process.argv[2]!)
const part = parseInt(process.argv[3]!)

type Day = {
  part1: () => void
  part2: () => void
}

const DAY_OBJECTS: Day[] = [day01, day02, day03]

const dayObject = DAY_OBJECTS[day - 1]

if (!dayObject) {
  throw new Error("Could not find day")
}

if (part !== 2) {
  dayObject.part1()
} else {
  dayObject.part2()
}
