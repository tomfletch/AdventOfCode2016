import fs from "fs"

type Turn = "L" | "R"

type Step = {
  turn: Turn
  distance: number
}

type Vector = {
  x: number
  y: number
}

const DIRECTIONS = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
] satisfies Vector[]

const part1 = () => {
  const steps = readSteps()

  let directionIndex = 0
  let x = 0
  let y = 0

  for (const step of steps) {
    directionIndex = turn(directionIndex, step.turn)
    const direction = DIRECTIONS[directionIndex] as Vector
    x += direction.x * step.distance
    y += direction.y * step.distance
  }

  const dist = manhattanDist(x, y)
  console.log("Distance: ", dist)
}

const part2 = () => {
  const steps = readSteps()
  const { x, y } = getFirstRepeatedLocation(steps)

  const dist = manhattanDist(x, y)
  console.log("Distance: ", dist)
}

const getFirstRepeatedLocation = (steps: Step[]): Vector => {
  const visited = new Set<string>()

  let directionIndex = 0
  let location = { x: 0, y: 0 }

  visited.add("0,0")

  for (const step of steps) {
    directionIndex = turn(directionIndex, step.turn)
    const direction = DIRECTIONS[directionIndex] as Vector

    for (let d = 0; d < step.distance; d++) {
      location.x += direction.x
      location.y += direction.y

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

const turn = (direction: number, turn: Turn): number => {
  if (turn === "L") {
    return (direction + 3) % 4
  }
  return (direction + 1) % 4
}

const manhattanDist = (x: number, y: number): number => {
  return Math.abs(x) + Math.abs(y)
}

export const day01 = { part1, part2 }
