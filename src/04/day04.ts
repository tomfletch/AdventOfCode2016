import fs from "fs"

type Room = {
  encryptedName: string
  sectorId: number
  checksum: string
}

const part1 = () => {
  const rooms = readRooms()
  const validRooms = rooms.filter(isRoomValid)
  const sectorSum = validRooms.map((r) => r.sectorId).reduce((s, c) => s + c)
  console.log(sectorSum)
}

const part2 = () => {}

const readRooms = (): Room[] => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  const data = fs.readFileSync(filepath, "utf-8").toString()
  const lines = data.split("\n")

  const rooms: Room[] = []

  lines.forEach((line) => {
    const match = line.match(/^([a-z-]+)-([0-9]+)\[([a-z]+)\]$/)
    if (!match) return

    const [_, encryptedName, sectorIdStr, checksum] = match
    if (!encryptedName || !sectorIdStr || !checksum) return

    const sectorId = parseInt(sectorIdStr)

    rooms.push({
      encryptedName,
      sectorId,
      checksum,
    })
  })

  return rooms
}

const isRoomValid = (room: Room): boolean => {
  const letters = room.encryptedName.replaceAll("-", "").split("").sort()

  const letterCounts: { letter: string; count: number }[] = []

  for (const letter of letters) {
    const letterCount = letterCounts.find((lc) => lc.letter === letter)

    if (letterCount) {
      letterCount.count += 1
    } else {
      letterCounts.push({ letter, count: 1 })
    }
  }

  const sorted = letterCounts.sort((a, b) => b.count - a.count)
  const firstFive = sorted
    .map((lc) => lc.letter)
    .join("")
    .substring(0, 5)

  return firstFive === room.checksum
}

export const day04 = { part1, part2 }
