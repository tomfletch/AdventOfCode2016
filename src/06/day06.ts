import fs from "fs"

const part1 = () => {
  const lines = readLines()

  const len = lines[0]!.length

  const message: string[] = []

  for (let i = 0; i < len; i++) {
    const letterCounts: Record<string, number> = {}
    let maxLetter = ""

    for (const line of lines) {
      const letter = line[i]!
      letterCounts[letter] = (letterCounts[letter] || 0) + 1

      if (!maxLetter || letterCounts[letter]! > letterCounts[maxLetter]!) {
        maxLetter = letter
      }
    }

    message.push(maxLetter)
  }

  console.log(message.join(""))
}

const part2 = () => {
  const lines = readLines()

  const len = lines[0]!.length

  const message: string[] = []

  for (let i = 0; i < len; i++) {
    const letterCounts: Record<string, number> = {}

    for (const line of lines) {
      const letter = line[i]!
      letterCounts[letter] = (letterCounts[letter] || 0) + 1
    }

    const minLetter = getMinCountLetter(letterCounts)
    message.push(minLetter)
  }

  console.log(message.join(""))
}

const getMinCountLetter = (counts: Record<string, number>): string => {
  let minLetter = ""
  let minCount = Infinity
  for (const letter in counts) {
    const letterCount = counts[letter]!
    if (letterCount < minCount) {
      minLetter = letter
      minCount = letterCount
    }
  }

  return minLetter
}

const readLines = () => {
  const filepath = new URL("./index.txt", import.meta.url).pathname
  return fs.readFileSync(filepath, "utf-8").toString().split("\n")
}

export const day06 = { part1, part2 }
