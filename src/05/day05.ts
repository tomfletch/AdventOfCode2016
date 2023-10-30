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

const part2 = () => {
  let i = 0
  const passwordChars: (string | null)[] = Array(8).fill(null)
  console.log(passwordChars.map((c) => c || "_").join(""))

  while (true) {
    const hash = md5(`${DOOR_ID}${i}`)
    i += 1

    if (!hash.startsWith("00000")) {
      continue
    }
    const pos = hash[5]!

    if (pos < "0" || pos > "7") {
      continue
    }

    const index = parseInt(pos)
    if (passwordChars[index]) {
      continue
    }

    const char = hash[6]!
    passwordChars[index] = char

    console.log(passwordChars.map((c) => c || "_").join(""))

    if (passwordChars.every((c) => c !== null)) {
      break
    }
  }

  const password = passwordChars.join("")
  console.log(password)
}

export const day05 = { part1, part2 }
