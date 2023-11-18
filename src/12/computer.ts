import fs from "fs"

export class Computer {
  private registers: { [key: string]: number }
  private ip: number
  private instructions: Instruction[]

  private static TOGGLE_COMMAND_LOOKUP: { [key: string]: string } = {
    inc: "dec",
    dec: "inc",
    tgl: "inc",
    jnz: "cpy",
    cpy: "jnz",
  }

  constructor() {
    this.registers = { a: 0, b: 0, c: 0, d: 0 }
    this.ip = 0
    this.instructions = []
  }

  run(instructions: Instruction[]) {
    this.instructions = instructions
    while (this.ip < this.instructions.length) {
      const instruction = this.instructions[this.ip]!
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
      case "jnz": {
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
      case "tgl": {
        const value = this.getValue(param1)
        const targetInstruction = this.instructions[this.ip + value]!

        if (targetInstruction) {
          targetInstruction.command = this.toggleCommand(
            targetInstruction.command
          )
        }
        return
      }
    }

    throw new Error(`command "${command}" not found`)
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

  private toggleCommand(command: string): string {
    if (command in Computer.TOGGLE_COMMAND_LOOKUP) {
      return Computer.TOGGLE_COMMAND_LOOKUP[command]!
    }
    throw new Error(`Attempt to toggle unknown command "${command}"`)
  }
}

type Instruction = {
  command: string
  param1: string | number
  param2?: string | number
}

export const readInstructions = (filepath: string): Instruction[] => {
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
