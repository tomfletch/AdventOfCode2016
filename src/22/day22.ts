import fs from "fs"

const BLOCKED_SIZE_THRESHOLD = 100

type Filesystem = {
  name: string
  x: number
  y: number
  size: number
  used: number
  available: number
}

const part1 = () => {
  const filesystems = readFilesystems()

  let viablePairs = 0

  for (let i = 0; i < filesystems.length; i++) {
    const nodeA = filesystems[i]!

    if (nodeA.used === 0) {
      continue
    }

    for (let j = 0; j < filesystems.length; j++) {
      if (i === j) {
        continue
      }

      const nodeB = filesystems[j]!

      if (nodeA.used <= nodeB.available) {
        viablePairs++
      }
    }
  }

  console.log(viablePairs)
}

const part2 = () => {
  const filesystems = readFilesystems()

  const width = Math.max(...filesystems.map((f) => f.x)) + 1
  const height = Math.max(...filesystems.map((f) => f.y)) + 1

  const initialState = getInitialState(filesystems, width, height)

  const states = [initialState]
  const distance = { [initialState]: 0 }

  while (states.length !== 0) {
    const state = states.shift()!

    if (state[0] === "G") {
      console.log(distance[state])
      return
    }

    const nextStates = getNextStates(state, width, height)

    for (const nextState of nextStates) {
      if (!(nextState in distance)) {
        states.push(nextState)
        distance[nextState] = distance[state]! + 1
      }
    }
  }
}

const getNextStates = (
  state: string,
  width: number,
  height: number
): string[] => {
  const nextStates: string[] = []

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = state[y * width + x]!

      if (cell !== "_") {
        continue
      }

      for (const direction of DIRECTIONS) {
        const otherX = x + direction.x
        const otherY = y + direction.y

        if (otherX < 0 || otherX >= width || otherY < 0 || otherY >= height) {
          continue
        }

        const otherCell = state[otherY * width + otherX]

        if (otherCell === "." || otherCell === "G") {
          const cells = state.split("")
          cells[y * width + x] = otherCell
          cells[otherY * width + otherX] = cell

          nextStates.push(cells.join(""))
        }
      }
    }
  }

  return nextStates
}

const getInitialState = (
  filesystems: Filesystem[],
  width: number,
  height: number
): string => {
  let state = ""

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y === 0 && x === width - 1) {
        state += "G"
      } else {
        const filesystem = filesystems.find((f) => f.x === x && f.y === y)!

        if (filesystem.used === 0) {
          state += "_"
        } else if (filesystem.used > BLOCKED_SIZE_THRESHOLD) {
          state += "#"
        } else {
          state += "."
        }
      }
    }
  }

  return state
}

const DIRECTIONS = [
  { x: 0, y: 1 },
  { x: 1, y: 0 },
  { x: 0, y: -1 },
  { x: -1, y: 0 },
] as const

const readFilesystems = (): Filesystem[] => {
  const filename = new URL("input.txt", import.meta.url).pathname
  const lines = fs.readFileSync(filename, "utf-8").toString().trim().split("\n")

  return lines.slice(2).map(parseFilesystem)
}

const parseFilesystem = (line: string): Filesystem => {
  const match = line.match(
    /^\/dev\/grid\/(node-x(\d+)-y(\d+))\s+(\d+)T\s+(\d+)T/
  )

  if (!match) {
    throw new Error(`Failed to parse filesystem: ${line}`)
  }

  const size = parseInt(match[4]!)
  const used = parseInt(match[5]!)
  const available = size - used

  return {
    name: match[1]!,
    x: parseInt(match[2]!),
    y: parseInt(match[3]!),
    size,
    used,
    available,
  }
}

export const day22 = { part1, part2 }
