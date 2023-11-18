import { readInstructions, Computer } from "../12/computer.js"

const filepath = new URL("./input.txt", import.meta.url).pathname

const part1 = () => {
  const instructions = readInstructions(filepath)
  const computer = new Computer()
  computer.setRegisterValue("a", 7)
  computer.run(instructions)
  console.log(computer.getRegisterValue("a"))
}

const part2 = () => {}

export const day23 = { part1, part2 }
