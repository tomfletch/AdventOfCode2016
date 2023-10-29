import fs from "fs"

type Triangle = readonly [number, number, number]

const part1 = () => {
  const triangles = readTriangles()
  const validTriangles = triangles.filter(isValidTriangle)
  console.log(validTriangles.length)
}

const part2 = () => {
  const triangles = readTriangles2()
  const validTriangles = triangles.filter(isValidTriangle)
  console.log(validTriangles.length)
}

const isValidTriangle = (triangle: Triangle): boolean => {
  const largest = Math.max(...triangle)
  const others = triangle.reduce((s, a) => s + a) - largest

  return largest < others
}

const readTriangles = (): Triangle[] => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  const lines = fs.readFileSync(filepath, "utf-8").toString().split("\n")

  return lines.map((line) => {
    return line
      .trim()
      .split(/\s+/)
      .map((part) => parseInt(part)) as [number, number, number]
  })
}

const readTriangles2 = (): Triangle[] => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  const lines = fs.readFileSync(filepath, "utf-8").toString().split("\n")

  const parsedLines = lines.map((line) => {
    return line
      .trim()
      .split(/\s+/)
      .map((part) => parseInt(part)) as [number, number, number]
  })

  const triangles: Triangle[] = []

  for (let i = 0; i < parsedLines.length / 3; i++) {
    const startLine = i * 3

    for (let x = 0; x < 3; x++) {
      triangles.push([
        parsedLines[startLine + 0]![x]!,
        parsedLines[startLine + 1]![x]!,
        parsedLines[startLine + 2]![x]!,
      ])
    }
  }

  return triangles
}

export const day03 = { part1, part2 }
