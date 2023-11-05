const TEST_1 = "..^^."
const TEST_2 = ".^^.^.^^^^"
const INPUT =
  "^..^^.^^^..^^.^...^^^^^....^.^..^^^.^.^.^^...^.^.^.^.^^.....^.^^.^.^.^.^.^.^^..^^^^^...^.....^....^."

const Chars = {
  SAFE: ".",
  TRAP: "^",
} as const

const part1 = () => {
  const map = new Map(INPUT)
  map.generateRows(40)
  // map.print()
  console.log(map.countSafeTiles())
}

const part2 = () => {
  const map = new Map(INPUT)
  map.generateRows(400000)
  console.log(map.countSafeTiles())
}

class Map {
  private width: number
  private rows: string[]
  constructor(firstRow: string) {
    this.width = firstRow.length
    this.rows = [firstRow]
  }

  generateRow() {
    let row = ""
    const prevRow = this.rows[this.rows.length - 1]!

    for (let x = 0; x < this.width; x++) {
      const left = x === 0 ? "." : prevRow[x - 1]!
      const right = x === this.width - 1 ? "." : prevRow[x + 1]!
      row += this.getChar(left, right)
    }

    this.rows.push(row)
  }

  generateRows(totalRows: number) {
    while (this.rows.length !== totalRows) {
      this.generateRow()
    }
  }

  getChar(left: string, right: string): string {
    const isLeftTrap = left === Chars.TRAP
    const isRightTrap = right === Chars.TRAP

    if (isLeftTrap !== isRightTrap) {
      return Chars.TRAP
    }

    return Chars.SAFE
  }

  countSafeTiles(): number {
    let count = 0
    for (const row of this.rows) {
      for (const tile of row.split("")) {
        if (tile === Chars.SAFE) {
          count += 1
        }
      }
    }
    return count
  }

  print() {
    for (const row of this.rows) {
      console.log(row)
    }
  }
}

export const day18 = { part1, part2 }
