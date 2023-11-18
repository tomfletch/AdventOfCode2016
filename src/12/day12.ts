import { readInstructions, Computer } from "./computer.js"

const filepath = new URL("./input.txt", import.meta.url).pathname

const part1 = () => {
  const instructions = readInstructions(filepath)
  const computer = new Computer()
  computer.run(instructions)
  console.log(computer.getRegisterValue("a"))
}

const part2 = () => {
  const instructions = readInstructions(filepath)
  const computer = new Computer()
  computer.setRegisterValue("c", 1)
  computer.run(instructions)
  console.log(computer.getRegisterValue("a"))
}

export const day12 = { part1, part2 }
