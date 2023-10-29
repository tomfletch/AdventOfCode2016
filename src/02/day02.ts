import fs from "fs"

const KEYPAD: string[][] = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
]

type Direction = "U" | "R" | "D" | "L"
type Vector = { x: number; y: number }

const DIRECTIONS = {
  U: { x: 0, y: -1 },
  R: { x: 1, y: 0 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
} as const satisfies Record<Direction, Vector>

const part1 = () => {
  const instructionLines = readInstructionLines()

  let position: Vector = { x: 1, y: 1 }

  const code: string[] = []

  for (const line of instructionLines) {
    for (const instruction of line) {
      const direction = DIRECTIONS[instruction]
      const newPosition: Vector = {
        x: position.x + direction.x,
        y: position.y + direction.y,
      }

      const digit = KEYPAD[newPosition.y]?.[newPosition.x]

      if (digit) {
        position = newPosition
      }
    }
    const digit = KEYPAD[position.y]?.[position.x]

    if (digit) {
      code.push(digit)
    }
  }

  console.log(code.join(""))
}

const KEYPAD2: (string | undefined)[][] = [
  [undefined, undefined, "1", undefined, undefined],
  [undefined, "2", "3", "4", undefined],
  ["5", "6", "7", "8", "9"],
  [undefined, "A", "B", "C", undefined],
  [undefined, undefined, "D", undefined, undefined],
]

const part2 = () => {
  const instructionLines = readInstructionLines()

  let position: Vector = { x: 0, y: 2 }

  const code: string[] = []

  for (const line of instructionLines) {
    for (const instruction of line) {
      const direction = DIRECTIONS[instruction]
      const newPosition: Vector = {
        x: position.x + direction.x,
        y: position.y + direction.y,
      }

      const digit = KEYPAD2[newPosition.y]?.[newPosition.x]

      if (digit) {
        position = newPosition
      }
    }

    const digit = KEYPAD2[position.y]?.[position.x]

    if (digit) {
      code.push(digit)
    }
  }

  console.log(code.join(""))
}

const readInstructionLines = (): Direction[][] => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  const data = fs.readFileSync(filepath, "utf-8").toString().trim()
  return data.split("\n").map((line) => line.split("") as Direction[])
}

export const day02 = { part1, part2 }
