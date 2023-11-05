const ELF_COUNT = 3014603

const part1 = () => {
  const skippedElves: boolean[] = Array(ELF_COUNT).fill(false)

  let elfIndex = 0
  let elvesRemaining = ELF_COUNT

  while (elvesRemaining > 1) {
    do {
      elfIndex = (elfIndex + 1) % ELF_COUNT
    } while (skippedElves[elfIndex])

    skippedElves[elfIndex] = true
    elvesRemaining -= 1

    do {
      elfIndex = (elfIndex + 1) % ELF_COUNT
    } while (skippedElves[elfIndex])
  }
  console.log(elfIndex + 1)
}

const part2 = () => {
  const skippedElves: boolean[] = Array(ELF_COUNT).fill(false)

  let elfIndex = 0
  let oppositeElfIndex = Math.floor(ELF_COUNT / 2)
  let elvesRemaining = ELF_COUNT

  let moveForwards = true

  while (elvesRemaining > 1) {
    skippedElves[oppositeElfIndex] = true
    elvesRemaining -= 1

    do {
      oppositeElfIndex = (oppositeElfIndex + 1) % ELF_COUNT
    } while (skippedElves[oppositeElfIndex])

    do {
      elfIndex = (elfIndex + 1) % ELF_COUNT
    } while (skippedElves[elfIndex])

    if (moveForwards) {
      do {
        oppositeElfIndex = (oppositeElfIndex + 1) % ELF_COUNT
      } while (skippedElves[oppositeElfIndex])
    }
    moveForwards = !moveForwards
  }
  console.log(elfIndex + 1)
}

export const day19 = { part1, part2 }
