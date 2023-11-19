import { readInstructions, Computer } from "../12/computer.js"

const filepath = new URL("./input.txt", import.meta.url).pathname

const part1 = () => {
  const instructions = readInstructions(filepath)
  let a = 1
  while (true) {
    console.log(`Trying a = ${a}`)
    const computer = new Computer()
    computer.setRegisterValue("a", a)
    computer.run(instructions)

    if (isValidOutput(computer.getOutput())) {
      console.log("Is valid output")
      break
    }

    a += 1
  }

  console.log(a)
}

const isValidOutput = (output: number[]): boolean => {
  let correctValue = 0

  for (const outputValue of output) {
    if (outputValue !== correctValue) {
      return false
    }
    correctValue = (correctValue + 1) % 2
  }

  return true
}

const part2 = () => {}

export const day25 = { part1, part2 }
