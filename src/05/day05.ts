import md5 from "md5"

const DOOR_ID = "wtnhxymk"

const part1 = () => {
  let i = 0
  const passwordChars: string[] = []

  while (passwordChars.length !== 8) {
    const hash = md5(`${DOOR_ID}${i}`)

    if (hash.startsWith("00000")) {
      passwordChars.push(hash[5]!)
    }

    i += 1
  }

  const password = passwordChars.join("")
  console.log(password)
}

const part2 = () => {}

export const day05 = { part1, part2 }
