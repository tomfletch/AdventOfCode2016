import fs from "fs"

const PASSWORD = "abcdefgh"
const SCRAMBLED = "fbgdceah"

interface Operation {
  run(password: string): string
  reverse(scrambled: string): string
}

class SwapPositionsOperation implements Operation {
  private firstPosition: number
  private secondPosition: number

  constructor(firstPosition: number, secondPosition: number) {
    this.firstPosition = firstPosition
    this.secondPosition = secondPosition
  }

  run(password: string): string {
    const letters = password.split("")

    const temp = letters[this.firstPosition]!
    letters[this.firstPosition] = letters[this.secondPosition]!
    letters[this.secondPosition] = temp

    return letters.join("")
  }

  reverse(scrambled: string): string {
    return this.run(scrambled)
  }
}

class SwapLettersOperation implements Operation {
  private firstLetter: string
  private secondLetter: string

  constructor(firstLetter: string, secondLetter: string) {
    this.firstLetter = firstLetter
    this.secondLetter = secondLetter
  }

  run(password: string): string {
    const letters = password.split("")

    const newLetters = letters.map((letter) => {
      switch (letter) {
        case this.firstLetter:
          return this.secondLetter
        case this.secondLetter:
          return this.firstLetter
        default:
          return letter
      }
    })

    return newLetters.join("")
  }

  reverse(scrambled: string): string {
    return this.run(scrambled)
  }
}

class RotateOperation implements Operation {
  private offset: number

  constructor(offset: number) {
    this.offset = offset
  }

  rotate(password: string, amount: number): string {
    const newStart = password.slice(amount)
    const newEnd = password.slice(0, amount)
    return `${newStart}${newEnd}`
  }

  run(password: string): string {
    return this.rotate(password, this.offset)
  }

  reverse(scrambled: string): string {
    return this.rotate(scrambled, -this.offset)
  }
}

class RotateFromLetterOperation implements Operation {
  private letter: string

  constructor(letter: string) {
    this.letter = letter
  }

  run(password: string): string {
    const letterIndex = password.indexOf(this.letter)
    const additionalOffset = letterIndex >= 4 ? 1 : 0
    const offset = -(letterIndex + 1 + additionalOffset) % password.length

    const newStart = password.slice(offset)
    const newEnd = password.slice(0, offset)
    return `${newStart}${newEnd}`
  }

  reverse(scrambled: string): string {
    const finalLetterIndex = scrambled.indexOf(this.letter)
    let password = scrambled

    while (true) {
      const newStart = password.slice(1)
      const newEnd = password.slice(0, 1)
      password = `${newStart}${newEnd}`

      const letterIndex = password.indexOf(this.letter)
      const additionalOffset = letterIndex >= 4 ? 1 : 0
      const offset = -(letterIndex + 1 + additionalOffset) % password.length

      if ((letterIndex - offset) % password.length === finalLetterIndex) {
        break
      }
    }

    return password
  }
}

class ReverseOperation implements Operation {
  private fromPosition: number
  private toPosition: number

  constructor(fromPosition: number, toPosition: number) {
    this.fromPosition = fromPosition
    this.toPosition = toPosition
  }

  run(password: string): string {
    const beforePart = password.slice(0, this.fromPosition)
    const reversePart = password.slice(this.fromPosition, this.toPosition + 1)
    const afterPart = password.slice(this.toPosition + 1)

    const reversed = reversePart.split("").reverse().join("")

    return `${beforePart}${reversed}${afterPart}`
  }

  reverse(scrambled: string): string {
    return this.run(scrambled)
  }
}

class MoveOperation implements Operation {
  private fromPosition: number
  private toPosition: number

  constructor(fromPosition: number, toPosition: number) {
    this.fromPosition = fromPosition
    this.toPosition = toPosition
  }

  move(password: string, from: number, to: number) {
    const letters = password.split("")
    const removed = letters.splice(from, 1)

    letters.splice(to, 0, ...removed)

    return letters.join("")
  }

  run(password: string): string {
    return this.move(password, this.fromPosition, this.toPosition)
  }

  reverse(scrambled: string): string {
    return this.move(scrambled, this.toPosition, this.fromPosition)
  }
}

const part1 = () => {
  const instructions = readInstructions()
  const scrambledPassword = scramble(PASSWORD, instructions)
  console.log(scrambledPassword)
}

const scramble = (password: string, instructions: Operation[]): string => {
  let scrambledPassword = password

  for (const instruction of instructions) {
    scrambledPassword = instruction.run(scrambledPassword)
  }

  return scrambledPassword
}

const part2 = () => {
  const instructions = readInstructions()
  const password = unscramble(SCRAMBLED, instructions)
  console.log(password)
}

const unscramble = (scrambled: string, instructions: Operation[]): string => {
  const reversedInstructions = [...instructions].reverse()

  let password = scrambled

  for (const instruction of reversedInstructions) {
    password = instruction.reverse(password)
  }

  return password
}

const readInstructions = (): Operation[] => {
  const filename = new URL("input.txt", import.meta.url).pathname
  const lines = fs.readFileSync(filename, "utf-8").toString().split("\n")
  return lines.map(parseInstruction)
}

const parseInstruction = (line: string): Operation => {
  let match = line.match(/^swap position (\d+) with position (\d+)$/)

  if (match) {
    const firstPosition = parseInt(match[1]!)
    const secondPosition = parseInt(match[2]!)
    return new SwapPositionsOperation(firstPosition, secondPosition)
  }

  match = line.match(/^swap letter (\w) with letter (\w)$/)

  if (match) {
    return new SwapLettersOperation(match[1]!, match[2]!)
  }

  match = line.match(/^rotate (left|right) (\d+) steps?$/)

  if (match) {
    const direction = match[1]!
    const offset = parseInt(match[2]!)
    return new RotateOperation(direction === "left" ? offset : -offset)
  }

  match = line.match(/^rotate based on position of letter (\w)$/)

  if (match) {
    return new RotateFromLetterOperation(match[1]!)
  }

  match = line.match(/^reverse positions (\d+) through (\d+)$/)

  if (match) {
    const fromPosition = parseInt(match[1]!)
    const toPosition = parseInt(match[2]!)
    return new ReverseOperation(fromPosition, toPosition)
  }

  match = line.match(/^move position (\d+) to position (\d+)$/)

  if (match) {
    const fromPosition = parseInt(match[1]!)
    const toPosition = parseInt(match[2]!)
    return new MoveOperation(fromPosition, toPosition)
  }

  throw new Error(`Failed to parse line: ${line}`)
}

export const day21 = { part1, part2 }
