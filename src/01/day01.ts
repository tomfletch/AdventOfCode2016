import fs from "fs"

type Turn = "L" | "R"

type Step = {
  turn: Turn
  distance: number
}

class Vector {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  manhattanDist(): number {
    return Math.abs(this.x) + Math.abs(this.y)
  }
}

const DIRECTIONS = [
  new Vector(0, 1),
  new Vector(1, 0),
  new Vector(0, -1),
  new Vector(-1, 0),
] satisfies Vector[]

class Character {
  private location: Vector
  private directionIndex: number

  constructor() {
    this.location = new Vector(0, 0)
    this.directionIndex = 0
  }

  turn(turn: Turn) {
    const turnDiff = turn === "L" ? 3 : 1
    this.directionIndex = (this.directionIndex + turnDiff) % 4
  }

  move(distance: number) {
    const direction = DIRECTIONS[this.directionIndex] as Vector
    this.location.x += direction.x * distance
    this.location.y += direction.y * distance
  }

  manhattanDist(): number {
    return this.location.manhattanDist()
  }

  getPosition(): Vector {
    return this.location
  }
}

const part1 = () => {
  const steps = readSteps()

  const character = new Character()

  for (const step of steps) {
    character.turn(step.turn)
    character.move(step.distance)
  }

  const dist = character.manhattanDist()
  console.log("Distance: ", dist)
}

const part2 = () => {
  const steps = readSteps()
  const character = new Character()
  moveToFirstRepeatedLocation(character, steps)

  const dist = character.manhattanDist()
  console.log("Distance: ", dist)
}

const moveToFirstRepeatedLocation = (
  character: Character,
  steps: Step[]
): Vector => {
  const visited = new Set<string>()

  visited.add("0,0")

  for (const step of steps) {
    character.turn(step.turn)

    for (let d = 0; d < step.distance; d++) {
      character.move(1)

      const location = character.getPosition()
      const pos = `${location.x},${location.y}`
      if (visited.has(pos)) {
        return location
      }
      visited.add(pos)
    }
  }

  throw new Error("No locations repeated")
}

const readSteps = (): Step[] => {
  const filePath = new URL("./input.txt", import.meta.url).pathname
  const data = fs.readFileSync(filePath, "utf8").toString()
  const steps = data.split(", ")
  return steps.map((step) => ({
    turn: step[0] as Turn,
    distance: parseInt(step.substring(1)),
  }))
}

export const day01 = { part1, part2 }
