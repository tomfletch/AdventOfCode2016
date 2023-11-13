import fs from "fs"

const MAX_IP = 4294967295

type Range = {
  from: number
  to: number
}

const part1 = () => {
  const blocklist = readBlocklist()

  const sparse: number[] = []

  for (const range of blocklist) {
    sparse.push(range.from - 1, range.to + 1)
  }

  sparse.sort((a, b) => a - b)

  const removed: boolean[] = Array(blocklist.length * 2).fill(false)

  for (const range of blocklist) {
    const fromIndex = sparse.indexOf(range.from - 1)
    const toIndex = sparse.indexOf(range.to + 1)

    for (let i = fromIndex + 1; i < toIndex; i++) {
      removed[i] = true
    }
  }

  for (let i = 0; i < sparse.length; i++) {
    const ip = sparse[i]!

    if (ip && ip >= 0 && ip <= MAX_IP && !removed[i]) {
      console.log(sparse[i])
      return
    }
  }
}

const part2 = () => {
  const blocklist = readBlocklist()
  blocklist.sort((a, b) => a.from - b.from)

  let from = 0
  const ranges: Range[] = []

  for (let i = 0; i < blocklist.length; i++) {
    const blockRange = blocklist[i]!

    if (blockRange.from - 1 < from) {
      if (from < blockRange.to + 1) {
        from = blockRange.to + 1
      }
    } else {
      ranges.push({
        from,
        to: blockRange.from - 1,
      })
      from = blockRange.to + 1
    }
  }

  const total = ranges.reduce(
    (acc, range) => acc + (range.to - range.from + 1),
    0
  )

  console.log(total)
}

const readBlocklist = (): Range[] => {
  const filename = new URL("./input.txt", import.meta.url).pathname
  const lines = fs.readFileSync(filename, "utf-8").toString().split("\n")
  return lines.map(parseRange)
}

const parseRange = (line: string): Range => {
  const parts = line.split("-")
  return {
    from: parseInt(parts[0]!),
    to: parseInt(parts[1]!),
  }
}

export const day20 = { part1, part2 }
