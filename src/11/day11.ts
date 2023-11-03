type Floor = 0 | 1 | 2 | 3

type State = {
  E: Floor
  steps: number
  items: {
    [key: string]: Floor
  }
  f: number
}

const part1 = () => {
  const elements = ["C", "P", "M", "R", "T"]

  const initialState: State = {
    E: 0,
    items: {
      CG: 0,
      CM: 0,
      PG: 0,
      PM: 1,
      MG: 0,
      MM: 1,
      RG: 0,
      RM: 0,
      TG: 0,
      TM: 0,
    },
    steps: 0,
    f: 0,
  }

  setStateCost(initialState)

  const states = [initialState]
  const foundStates = new Set([serialize(initialState)])

  console.time("part1")
  let seenStates = 0

  while (states.length !== 0) {
    seenStates += 1

    let lowestCost = Infinity
    let lowestCostState: State | null = null
    let lowestCostIndex: number | null = null

    for (let i = 0; i < states.length; i++) {
      const state = states[i]!

      if (state.f < lowestCost) {
        lowestCost = state.f
        lowestCostState = state
        lowestCostIndex = i
      }
    }

    if (lowestCostState === null || lowestCostIndex === null) {
      throw new Error("Failed to find lowest cost state")
    }

    states.splice(lowestCostIndex, 1)

    if (isGoal(lowestCostState)) {
      console.log(lowestCostState.steps)
      break
    }

    const nextStates = getNextStates(lowestCostState, elements)

    for (const nextState of nextStates) {
      const serializedState = serialize(nextState)
      if (!foundStates.has(serializedState)) {
        states.push(nextState)
        foundStates.add(serializedState)
      }
    }
  }

  console.log("seen states", seenStates)
  console.timeEnd("part1")
}

const serialize = (state: State): string => {
  return `${state.E}${Object.values(state.items).join("")}`
}

const isGoal = (state: State): boolean => {
  for (const item of Object.keys(state.items)) {
    if (state.items[item] !== 3) {
      return false
    }
  }
  return true
}

const setStateCost = (state: State) => {
  let total = 0
  for (const item in state.items) {
    total += 3 - state.items[item]!
  }
  state.f = state.steps + total
}

const getNextStates = (state: State, elements: string[]): State[] => {
  const elevatorFloor = state.E

  const itemsOnFloor = getItemsOnFloor(state, elevatorFloor)
  const pickupOptions = getPickupOptions(itemsOnFloor)
  const nextFloorOptions = getNextFloorOptions(elevatorFloor)

  const nextStates: State[] = []

  for (const pickupChoice of pickupOptions) {
    for (const nextFloorChoice of nextFloorOptions) {
      const newState = {
        E: nextFloorChoice,
        items: { ...state.items },
        steps: state.steps + 1,
        f: 0,
      }

      setStateCost(newState)

      for (const pickupItem of pickupChoice) {
        newState.items[pickupItem] = nextFloorChoice
      }

      if (isStateValid(newState, elements)) {
        nextStates.push(newState)
      }
    }
  }

  return nextStates
}

const getItemsOnFloor = (state: State, floor: Floor): string[] => {
  return Object.keys(state.items).filter((item) => state.items[item] === floor)
}

const getPickupOptions = (items: string[]): string[][] => {
  const pickupOptions: string[][] = []

  for (const item of items) {
    pickupOptions.push([item])
  }

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const itemA = items[i]!
      const itemB = items[j]!
      if (itemA[1] === itemB[1] || itemA[0] === itemB[0]) {
        pickupOptions.push([itemA, itemB])
      }
    }
  }

  return pickupOptions
}

const NEXT_FLOOR_OPTIONS: Record<Floor, Floor[]> = {
  0: [1],
  1: [0, 2],
  2: [1, 3],
  3: [2],
}

const getNextFloorOptions = (floor: Floor): Floor[] => {
  return NEXT_FLOOR_OPTIONS[floor]
}

const isStateValid = (state: State, elements: string[]): boolean => {
  for (const element of elements) {
    if (!isMicrochipElementValid(state, element, elements)) {
      return false
    }
  }
  return true
}

const isMicrochipElementValid = (
  state: State,
  element: string,
  elements: string[]
): boolean => {
  const microchipFloor = getElementMicrochipFloor(state, element)
  const generatorFloor = getElementGeneratorFloor(state, element)

  if (microchipFloor === generatorFloor) {
    return true
  }

  for (const otherElement of elements) {
    if (otherElement === element) {
      continue
    }

    const otherGeneratorFloor = getElementGeneratorFloor(state, otherElement)
    if (otherGeneratorFloor === microchipFloor) {
      return false
    }
  }

  return true
}

const getElementGeneratorFloor = (state: State, element: string): number => {
  return state.items[element + "G"]!
}

const getElementMicrochipFloor = (state: State, element: string): number => {
  return state.items[element + "M"]!
}

const part2 = () => {
  const elements = ["C", "P", "M", "R", "T", "E", "D"]

  const initialState: State = {
    E: 0,
    items: {
      CG: 0,
      CM: 0,
      PG: 0,
      PM: 1,
      MG: 0,
      MM: 1,
      RG: 0,
      RM: 0,
      TG: 0,
      TM: 0,
      EG: 0,
      EM: 0,
      DG: 0,
      DM: 0,
    },
    steps: 0,
    f: 0,
  }

  setStateCost(initialState)

  const states = [initialState]
  const foundStates = new Set([serialize(initialState)])

  while (states.length !== 0) {
    if (states.length % 1000 === 0) {
      console.log(states.length)
    }
    const state = states.shift()!

    if (isGoal(state)) {
      console.log(state.steps)
      return
    }

    const nextStates = getNextStates(state, elements)

    for (const nextState of nextStates) {
      const serializedState = serialize(nextState)
      if (!foundStates.has(serializedState)) {
        states.push(nextState)
        foundStates.add(serializedState)
      }
    }
  }
}

export const day11 = { part1, part2 }
