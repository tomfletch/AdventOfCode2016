import fs from "fs"

const WIDTH = 50
const HEIGHT = 6

type Instruction =
  | {
      type: "rect"
      width: number
      height: number
    }
  | {
      type: "rotateRow"
      y: number
      offset: number
    }
  | {
      type: "rotateCol"
      x: number
      offset: number
    }

const part1 = () => {
  const instructions = readInstructions()
  const screen = new Screen(WIDTH, HEIGHT)

  for (const instruction of instructions) {
    doInstruction(screen, instruction)
  }

  console.log(screen.countOn())
}

const doInstruction = (screen: Screen, instruction: Instruction) => {
  switch (instruction.type) {
    case "rect":
      return screen.rect(instruction.width, instruction.height)
    case "rotateRow":
      return screen.rotateRow(instruction.y, instruction.offset)
    case "rotateCol":
      return screen.rotateCol(instruction.x, instruction.offset)
  }
  instruction satisfies never
}

const part2 = () => {
  const instructions = readInstructions()
  const screen = new Screen(WIDTH, HEIGHT)

  for (const instruction of instructions) {
    doInstruction(screen, instruction)
  }

  screen.print()
}

class Screen {
  private width: number
  private height: number
  private pixels: boolean[][]

  constructor(width: number, height: number) {
    this.width = width
    this.height = height

    this.pixels = Array.from(Array(height), () => Array(width).fill(false))
  }

  rect(w: number, h: number) {
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        this.pixels[y]![x] = true
      }
    }
  }

  rotateRow(y: number, offset: number) {
    const start = this.pixels[y]!.slice(0, this.width - offset)
    const end = this.pixels[y]!.slice(this.width - offset, this.width)
    this.pixels[y] = [...end, ...start]
  }

  rotateCol(x: number, offset: number) {
    const col: boolean[] = []

    for (let y = 0; y < this.height; y++) {
      col.push(this.pixels[y]![x]!)
    }

    for (let y = 0; y < this.height; y++) {
      this.pixels[y]![x] = col[(y + this.height - offset) % this.height]!!
    }
  }

  countOn() {
    let total = 0

    for (const row of this.pixels) {
      for (const pixel of row) {
        if (pixel) {
          total += 1
        }
      }
    }

    return total
  }

  print() {
    for (const row of this.pixels) {
      console.log(row.map((v) => (v ? "#" : " ")).join(""))
    }
  }
}

const readInstructions = () => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  return fs
    .readFileSync(filepath, "utf-8")
    .toString()
    .split("\n")
    .map(parseInstruction)
}

const parseInstruction = (str: string): Instruction => {
  let match = str.match(/^rect (\d+)x(\d+)$/)

  if (match) {
    return {
      type: "rect",
      width: parseInt(match[1]!),
      height: parseInt(match[2]!),
    }
  }

  match = str.match(/^rotate row y=(\d+) by (\d+)$/)

  if (match) {
    return {
      type: "rotateRow",
      y: parseInt(match[1]!),
      offset: parseInt(match[2]!),
    }
  }

  match = str.match(/^rotate column x=(\d+) by (\d+)$/)

  if (match) {
    return {
      type: "rotateCol",
      x: parseInt(match[1]!),
      offset: parseInt(match[2]!),
    }
  }

  throw new Error("Invalid instruction")
}

export const day08 = { part1, part2 }
