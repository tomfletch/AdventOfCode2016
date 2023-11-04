const SEED = 1352

type Vector = {
  x: number
  y: number
}

const DIRECTIONS: Vector[] = [
  { x: 1, y: 0 },
  { x: 0, y: 1 },
  { x: -1, y: 0 },
  { x: 0, y: -1 },
]

type State = {
  pos: Vector
  steps: number
}

class VectorSet {
  private set: Set<string>
  constructor() {
    this.set = new Set()
  }

  private vectorToString(v: Vector): string {
    return `${v.x},${v.y}`
  }

  add(v: Vector) {
    this.set.add(this.vectorToString(v))
  }

  has(v: Vector) {
    return this.set.has(this.vectorToString(v))
  }

  size() {
    return this.set.size
  }
}

const part1 = () => {
  const initialState: State = {
    pos: { x: 1, y: 1 },
    steps: 0,
  }

  const states = [initialState]
  const visitedSquares = new VectorSet()
  visitedSquares.add(initialState.pos)

  while (states.length !== 0) {
    const state = states.shift()!

    if (state.pos.x === 31 && state.pos.y === 39) {
      console.log(state.steps)
      return
    }

    const nextStates = getNextStates(state)

    for (const nextState of nextStates) {
      if (!visitedSquares.has(nextState.pos)) {
        visitedSquares.add(nextState.pos)
        states.push(nextState)
      }
    }
  }
}

const getNextStates = (state: State): State[] => {
  const nextStates: State[] = []
  for (const direction of DIRECTIONS) {
    const nextPos: Vector = {
      x: state.pos.x + direction.x,
      y: state.pos.y + direction.y,
    }

    const nextState: State = {
      pos: nextPos,
      steps: state.steps + 1,
    }

    if (nextPos.x >= 0 && nextPos.y >= 0 && !isWall(nextPos)) {
      nextStates.push(nextState)
    }
  }
  return nextStates
}

const part2 = () => {
  const initialState: State = {
    pos: { x: 1, y: 1 },
    steps: 0,
  }

  const states = [initialState]
  const visitedSquares = new VectorSet()
  visitedSquares.add(initialState.pos)

  while (states.length !== 0) {
    const state = states.shift()!

    if (state.steps < 50) {
      const nextStates = getNextStates(state)

      for (const nextState of nextStates) {
        if (!visitedSquares.has(nextState.pos)) {
          visitedSquares.add(nextState.pos)
          states.push(nextState)
        }
      }
    }
  }

  console.log(visitedSquares.size())
}

const isWall = (pos: Vector): boolean => {
  const { x, y } = pos
  const value = x * x + 3 * x + 2 * x * y + y + y * y + SEED
  return isBinaryOnesOdd(value)
}

const isBinaryOnesOdd = (value: number) => {
  let count = 0
  while (value) {
    count += value & 1
    value >>= 1
  }
  return count % 2 === 1
}

export const day13 = { part1, part2 }
