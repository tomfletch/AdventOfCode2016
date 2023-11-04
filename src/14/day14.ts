import md5 from "md5"

const SALT = "qzyelonm"

class KeyGenerator {
  private salt: string
  private hashes: Record<number, string> = {}
  private currentIndex: number

  constructor(salt: string) {
    this.salt = salt
    this.currentIndex = -1
  }

  getNextKeyIndex(): number {
    while (!this.isValidKey(this.currentIndex)) {
      this.currentIndex++
    }

    return this.currentIndex++
  }

  private isValidKey(i: number): boolean {
    const hash = this.getHash(i)
    const tripleChar = this.getFirstTriple(hash)

    if (!tripleChar) {
      return false
    }

    for (let j = i + 1; j <= i + 1001; j++) {
      const otherHash = this.getHash(j)
      if (this.hasQuintuple(otherHash, tripleChar)) {
        return true
      }
    }

    return false
  }

  private hasQuintuple(hash: string, searchChar: string) {
    let count = 0

    for (const char of hash) {
      if (char === searchChar) {
        count += 1

        if (count === 5) {
          return true
        }
      } else {
        count = 0
      }
    }

    return false
  }

  private getFirstTriple(hash: string): string | null {
    let lastChar: string | null = null
    let lastCharCount = 0

    for (const char of hash) {
      if (char === lastChar) {
        lastCharCount += 1

        if (lastCharCount === 3) {
          return char
        }
      } else {
        lastChar = char
        lastCharCount = 1
      }
    }

    return null
  }

  private getHash(i: number): string {
    if (!(i in this.hashes)) {
      this.hashes[i] = this.generateHash(i)
    }

    return this.hashes[i]!
  }

  private generateHash(i: number): string {
    return md5(`${SALT}${i}`).toLowerCase()
  }
}

const part1 = () => {
  const keyGenerator = new KeyGenerator(SALT)

  let index = 0

  for (let i = 0; i < 64; i++) {
    index = keyGenerator.getNextKeyIndex()
  }

  console.log(index)
}

const part2 = () => {}

export const day14 = { part1, part2 }
