import { day01 } from "./01/day01.js"
import { day02 } from "./02/day02.js"
import { day03 } from "./03/day03.js"
import { day04 } from "./04/day04.js"
import { day05 } from "./05/day05.js"
import { day06 } from "./06/day06.js"
import { day07 } from "./07/day07.js"
import { day08 } from "./08/day08.js"
import { day09 } from "./09/day09.js"
import { day10 } from "./10/day10.js"
import { day11 } from "./11/day11.js"
import { day12 } from "./12/day12.js"
import { day13 } from "./13/day13.js"
import { day14 } from "./14/day14.js"

console.clear()

const day = parseInt(process.argv[2]!)
const part = parseInt(process.argv[3]!)

type Day = {
  part1: () => void
  part2: () => void
}

const DAY_OBJECTS: Day[] = [
  day01,
  day02,
  day03,
  day04,
  day05,
  day06,
  day07,
  day08,
  day09,
  day10,
  day11,
  day12,
  day13,
  day14,
]

const dayObject = DAY_OBJECTS[day - 1]

if (!dayObject) {
  throw new Error("Could not find day")
}

if (part !== 2) {
  dayObject.part1()
} else {
  dayObject.part2()
}
