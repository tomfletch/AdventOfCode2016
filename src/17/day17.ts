import md5 from "md5"

const PASSCODE = "yjjvjgan"

type Vector = {
  x: number
  y: number
}

type DirectionChar = "U" | "D" | "L" | "R"

const GRID_SIZE = 4

const DIRECTIONS = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
} as const satisfies Record<DirectionChar, Vector>

const DIRECTION_HASH_POSITION = {
  U: 0,
  D: 1,
  L: 2,
  R: 3,
} as const satisfies Record<DirectionChar, number>

type State = {
  position: Vector
  path: string
}

const part1 = () => {
  const initialState = { position: { x: 0, y: 0 }, path: "" }
  const states: State[] = [initialState]

  while (states.length !== 0) {
    const state = states.shift()!

    if (isGoal(state)) {
      console.log(state.path)
      return
    }

    const nextStates = getNextStates(state)

    for (const nextState of nextStates) {
      states.push(nextState)
    }
  }
}

const part2 = () => {
  const initialState = { position: { x: 0, y: 0 }, path: "" }
  const states: State[] = [initialState]

  let longestPath = 0

  while (states.length !== 0) {
    const state = states.shift()!

    if (isGoal(state)) {
      if (state.path.length > longestPath) {
        longestPath = state.path.length
      }
    } else {
      const nextStates = getNextStates(state)

      for (const nextState of nextStates) {
        states.unshift(nextState)
      }
    }
  }

  console.log(longestPath)
}

const isGoal = (state: State): boolean => {
  const { x, y } = state.position
  return x === GRID_SIZE - 1 && y === GRID_SIZE - 1
}

const getNextStates = (state: State): State[] => {
  const nextStates: State[] = []

  const hash = md5(`${PASSCODE}${state.path}`)

  let directionChar: DirectionChar
  for (directionChar in DIRECTIONS) {
    const direction = DIRECTIONS[directionChar]
    const nextPosition = {
      x: state.position.x + direction.x,
      y: state.position.y + direction.y,
    }

    if (!isPositionInGrid(nextPosition)) {
      continue
    }

    if (!isDoorOpen(hash, directionChar)) {
      continue
    }

    nextStates.push({
      position: nextPosition,
      path: `${state.path}${directionChar}`,
    })
  }

  return nextStates
}

const isPositionInGrid = (position: Vector): boolean => {
  const { x, y } = position
  return x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE
}

const isDoorOpen = (hash: string, direction: DirectionChar): boolean => {
  const hashPosition = DIRECTION_HASH_POSITION[direction]
  return isCharOpen(hash[hashPosition]!)
}

const isCharOpen = (char: string) => char >= "b"

export const day17 = { part1, part2 }
