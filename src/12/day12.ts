import fs from "fs"

const part1 = () => {
  const instructions = readInstructions()
  const computer = new Computer()
  computer.run(instructions)
  console.log(computer.getRegisterValue("a"))
}

const part2 = () => {
  const instructions = readInstructions()
  const computer = new Computer()
  computer.setRegisterValue("c", 1)
  computer.run(instructions)
  console.log(computer.getRegisterValue("a"))
}

class Computer {
  private registers: { [key: string]: number }
  private ip: number
  constructor() {
    this.registers = { a: 0, b: 0, c: 0, d: 0 }
    this.ip = 0
  }

  run(instructions: Instruction[]) {
    while (this.ip < instructions.length) {
      const instruction = instructions[this.ip]!
      this.doInstruction(instruction)
      this.ip += 1
    }
  }

  setRegisterValue(register: string, value: number) {
    this.registers[register] = value
  }

  getRegisterValue(register: string) {
    return this.registers[register]
  }

  private doInstruction(instruction: Instruction) {
    const { command, param1, param2 } = instruction

    switch (command) {
      case "cpy":
        if (!param2) {
          throw new Error("cpy command requires 2 params")
        }
        this.registers[param2] = this.getValue(param1)
        return
      case "inc":
        this.registers[param1] += 1
        return
      case "dec":
        this.registers[param1] -= 1
        return
      case "jnz":
        if (!param2) {
          throw new Error("jnz command requires 2 params")
        }
        const value1 = this.getValue(param1)
        if (value1 !== 0) {
          const value2 = this.getValue(param2)
          this.ip += value2 - 1
        }
        return
    }
  }

  private getValue(param?: string | number): number {
    switch (typeof param) {
      case "number":
        return param
      case "string":
        const value = this.registers[param]
        if (typeof value === "undefined") {
          throw new Error("Param is not a value")
        }
        return value
    }
    throw new Error("Invalid param")
  }
}

type Instruction = {
  command: string
  param1: string | number
  param2?: string | number
}

const readInstructions = (): Instruction[] => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  const lines = fs.readFileSync(filepath, "utf-8").toString().split("\n")
  return lines.map(parseInstruction)
}

const parseInstruction = (line: string): Instruction => {
  const parts = line.split(" ")

  return {
    command: parts[0]!,
    param1: parseParam(parts[1]!),
    param2: parts[2] !== undefined ? parseParam(parts[2]) : undefined,
  }
}

const parseParam = (param: string): string | number => {
  const int = parseInt(param, 10)
  return isNaN(int) ? param : int
}

export const day12 = { part1, part2 }
