import fs from "fs"

type Vector = {
  x: number
  y: number
}

type Map = {
  walls: boolean[][]
  width: number
  height: number
  positions: Record<string, Vector>
}

const DIRECTIONS = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
] as const

const part1 = () => {
  calculateMinDistance(false)
}

const part2 = () => {
  calculateMinDistance(true)
}

const calculateMinDistance = (returnToZero: boolean) => {
  const map = readMap()

  const distances: Record<string, number> = {}

  const positionKeys = Object.keys(map.positions)

  for (let i = 0; i < positionKeys.length; i++) {
    const iKey = positionKeys[i]!
    for (let j = i + 1; j < positionKeys.length; j++) {
      const jKey = positionKeys[j]!
      distances[`${iKey}-${jKey}`] = distanceBetween(map, iKey, jKey)
    }
  }

  const positionKeysWithoutStart = positionKeys.filter((k) => k !== "0")

  const paths = permutations(positionKeysWithoutStart)

  let minDistance = Infinity

  for (const path of paths) {
    const fullPath = ["0", ...path]

    if (returnToZero) {
      fullPath.push("0")
    }

    const pathDistance = calculatePathDistance(fullPath, distances)

    if (pathDistance < minDistance) {
      minDistance = pathDistance
    }
  }

  console.log(minDistance)
}

const calculatePathDistance = (
  path: string[],
  distances: Record<string, number>
): number => {
  let distance = 0

  for (let i = 1; i < path.length; i++) {
    const part = path.slice(i - 1, i + 1)
    part.sort()
    distance += distances[`${part[0]}-${part[1]}`]!
  }

  return distance
}

const distanceBetween = (map: Map, a: string, b: string): number => {
  const initialState = map.positions[a]!
  const goalState = map.positions[b]!
  const states = [initialState]
  const distances = { [`${initialState.x},${initialState.y}`]: 0 }

  while (states.length !== 0) {
    const state = states.shift()!
    const stateDistance = distances[`${state.x},${state.y}`]!

    if (state.x === goalState.x && state.y === goalState.y) {
      return stateDistance
    }

    const nextStates = getNextStates(map, state)

    for (const nextState of nextStates) {
      if (!(`${nextState.x},${nextState.y}` in distances)) {
        states.push(nextState)
        distances[`${nextState.x},${nextState.y}`] = stateDistance + 1
      }
    }
  }

  throw new Error(`Failed to find a path from ${a} to ${b}`)
}

const permutations = <T>(arr: T[]): T[][] => {
  return generatePermutations(arr.length, arr)
}

const generatePermutations = <T>(k: number, arr: T[]): T[][] => {
  if (k === 1) {
    return [[...arr]]
  }

  const permutations: T[][] = []

  permutations.push(...generatePermutations(k - 1, arr))

  for (let i = 0; i < k - 1; i++) {
    if (k % 2 === 0) {
      ;[arr[i], arr[k - 1]] = [arr[k - 1]!, arr[i]!]
    } else {
      ;[arr[0], arr[k - 1]] = [arr[k - 1]!, arr[0]!]
    }

    permutations.push(...generatePermutations(k - 1, arr))
  }

  return permutations
}

const getNextStates = (map: Map, state: Vector): Vector[] => {
  const newStates: Vector[] = []

  for (const direction of DIRECTIONS) {
    const x = state.x + direction.x
    const y = state.y + direction.y

    if (x < 0 || x >= map.width || y < 0 || y >= map.height) {
      continue
    }

    const isWall = map.walls[y]![x]!

    if (!isWall) {
      newStates.push({ x, y })
    }
  }

  return newStates
}

const readMap = (): Map => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  const data = fs.readFileSync(filepath, "utf-8").toString()
  const rows = data.split("\n")

  const walls = rows.map((row) => row.split("").map((cell) => cell === "#"))

  const width = rows[0]!.length
  const height = rows.length

  const positions: Record<string, Vector> = {}

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = rows[y]![x]!

      if (cell >= "0" && cell <= "9") {
        positions[cell] = { x, y }
      }
    }
  }

  return {
    walls,
    width,
    height,
    positions,
  }
}

export const day24 = { part1, part2 }
