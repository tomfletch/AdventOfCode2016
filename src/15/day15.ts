import fs from "fs"

const part1 = () => {
  const discs = readDiscs()

  let t = 0

  while (!isLinedUp(discs, t)) {
    t++
  }

  console.log(t)
}

const part2 = () => {
  const discs = readDiscs()
  discs.push({
    id: discs.length + 1,
    positions: 11,
    initialPosition: 0,
  })

  let t = 0

  while (!isLinedUp(discs, t)) {
    t++
  }

  console.log(t)
}

type Disc = {
  id: number
  positions: number
  initialPosition: number
}

const readDiscs = (): Disc[] => {
  const filename = new URL("./input.txt", import.meta.url).pathname
  const lines = fs.readFileSync(filename, "utf-8").toString().split("\n")
  return lines.map(parseDisc)
}

const parseDisc = (line: string): Disc => {
  const match = line.match(
    /^Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+).$/
  )

  if (!match) {
    throw new Error("Failed to parse disc")
  }

  return {
    id: parseInt(match[1]!),
    positions: parseInt(match[2]!),
    initialPosition: parseInt(match[3]!),
  }
}

const isLinedUp = (discs: Disc[], offset: number): boolean => {
  return discs.every((disc) => isDiscLinedUp(disc, offset))
}

const isDiscLinedUp = (disc: Disc, offset: number): boolean => {
  return (disc.initialPosition + disc.id + offset) % disc.positions === 0
}

export const day15 = { part1, part2 }
