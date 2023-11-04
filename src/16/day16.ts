import assert from "assert"

const part1 = () => {
  assert(generateData("111100001010") === "1111000010100101011110000")
  assert(generateChecksum("110010110100") === "100")

  const initialState = "10011111011011001"
  const diskLength = 272

  const disk = fillDisk(initialState, diskLength)
  const checksum = generateChecksum(disk)

  console.log(checksum)
}

const part2 = () => {
  const initialState = "10011111011011001"
  const diskLength = 35651584

  const disk = fillDisk(initialState, diskLength)
  const checksum = generateChecksum(disk)

  console.log(checksum)
}

const fillDisk = (initialState: string, diskLength: number): string => {
  let data = initialState
  while (data.length < diskLength) {
    data = generateData(data)
  }

  return data.substring(0, diskLength)
}

const generateData = (a: string): string => {
  const b = a
    .split("")
    .reverse()
    .map((c) => (c === "0" ? "1" : "0"))
    .join("")

  return a + "0" + b
}

const generateChecksum = (data: string): string => {
  while (data.length % 2 === 0) {
    let newData = ""
    for (let i = 0; i < data.length / 2; i++) {
      if (data[i * 2] === data[i * 2 + 1]) {
        newData += "1"
      } else {
        newData += "0"
      }
    }
    data = newData
  }
  return data
}

export const day16 = { part1, part2 }
