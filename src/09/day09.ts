import assert from "assert"
import fs from "fs"

type State = "normal"

const part1 = () => {
  const compressedFile = readFile()
  const decompressed = decompress(compressedFile)
  console.log(decompressed.length)
}

const part2 = () => {
  let compressed = readFile()
  let decompressedLength = decompressLength(compressed)

  console.log(decompressedLength)
}

const decompress = (compressed: string): string => {
  let output = ""
  let remainder: string = compressed

  while (remainder) {
    const openIndex = remainder.indexOf("(")
    const closeIndex = remainder.indexOf(")")

    if (openIndex !== -1) {
      output += remainder.slice(0, openIndex)

      const code = remainder.slice(openIndex + 1, closeIndex)
      remainder = remainder.slice(closeIndex + 1)
      const { len, rep } = parseCode(code)

      const copySection = remainder.slice(0, len)
      for (let i = 0; i < rep; i++) {
        output += copySection
      }

      remainder = remainder.slice(len)
    } else {
      output += remainder
      remainder = ""
    }
  }

  return output
}

const decompressLength = (compressed: string): number => {
  let length = 0
  let remainder: string = compressed

  while (remainder) {
    const openIndex = remainder.indexOf("(")
    const closeIndex = remainder.indexOf(")")

    if (openIndex !== -1) {
      length += openIndex

      const code = remainder.slice(openIndex + 1, closeIndex)
      remainder = remainder.slice(closeIndex + 1)
      const { len, rep } = parseCode(code)

      const copySection = remainder.slice(0, len)
      const copyDecompressLength = decompressLength(copySection)

      length += copyDecompressLength * rep
      remainder = remainder.slice(len)
    } else {
      length += remainder.length
      remainder = ""
    }
  }

  return length
}

const parseCode = (code: string) => {
  const [lenStr, repStr] = code.split("x")
  assert(lenStr && repStr)

  const len = parseInt(lenStr)
  const rep = parseInt(repStr)

  return { len, rep }
}

const readFile = () => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  return fs.readFileSync(filepath, "utf-8").toString().trim()
}

export const day09 = { part1, part2 }
