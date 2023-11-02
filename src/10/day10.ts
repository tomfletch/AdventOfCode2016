import assert from "assert"
import fs from "fs"

type Input = {
  value: number
  outputBot: number
}

type GiveToRuleType = "bot" | "output"

type GiveToRule = {
  type: GiveToRuleType
  id: number
}

type Bot = {
  id: number
  lowOutput: GiveToRule
  highOutput: GiveToRule
  inputs: number[]
}

const part1 = () => {
  const { inputs, bots } = readInstructions()

  const botsById: Record<number, Bot> = {}

  for (const bot of bots) {
    botsById[bot.id] = bot
  }

  for (const input of inputs) {
    const bot = botsById[input.outputBot]!
    bot.inputs.push(input.value)
  }

  let remainingBots = bots

  while (true) {
    const { botsWithTwoInputs, otherBots } =
      filterBotsByTwoInputs(remainingBots)
    remainingBots = otherBots

    for (const bot of botsWithTwoInputs) {
      bot.inputs.sort((a, b) => a - b)

      if (bot.inputs[0] === 17 && bot.inputs[1] === 61) {
        console.log(bot.id)
        return
      }

      if (bot.lowOutput.type === "bot") {
        const lowOutputBot = botsById[bot.lowOutput.id]!
        lowOutputBot.inputs.push(bot.inputs[0]!)
      }

      if (bot.highOutput.type === "bot") {
        const highOutputBot = botsById[bot.highOutput.id]!
        highOutputBot.inputs.push(bot.inputs[1]!)
      }
    }
  }
}

const filterBotsByTwoInputs = (bots: Bot[]) => {
  let botsWithTwoInputs: Bot[] = []
  let otherBots: Bot[] = []

  bots.forEach((b) => {
    if (b.inputs.length === 2) {
      botsWithTwoInputs.push(b)
    } else {
      otherBots.push(b)
    }
  })

  return { botsWithTwoInputs, otherBots }
}

const part2 = () => {
  const { inputs, bots } = readInstructions()

  const botsById: Record<number, Bot> = {}

  for (const bot of bots) {
    botsById[bot.id] = bot
  }

  for (const input of inputs) {
    const bot = botsById[input.outputBot]!
    bot.inputs.push(input.value)
  }

  let remainingBots = bots

  const outputs: Record<number, number> = {}

  while (remainingBots.length !== 0) {
    const { botsWithTwoInputs, otherBots } =
      filterBotsByTwoInputs(remainingBots)
    remainingBots = otherBots

    for (const bot of botsWithTwoInputs) {
      bot.inputs.sort((a, b) => a - b)

      if (bot.lowOutput.type === "bot") {
        const lowOutputBot = botsById[bot.lowOutput.id]!
        lowOutputBot.inputs.push(bot.inputs[0]!)
      } else {
        outputs[bot.lowOutput.id] = bot.inputs[0]!
      }

      if (bot.highOutput.type === "bot") {
        const highOutputBot = botsById[bot.highOutput.id]!
        highOutputBot.inputs.push(bot.inputs[1]!)
      } else {
        outputs[bot.highOutput.id] = bot.inputs[1]!
      }
    }
  }

  console.log(outputs[0]! * outputs[1]! * outputs[2]!)
}

const readInstructions = () => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  const file = fs.readFileSync(filepath, "utf-8").toString().trim()
  const lines = file.split("\n")

  const instructions = lines.map(parseInstruction)
  const inputs = instructions.filter((i) => "value" in i) as Input[]
  const bots = instructions.filter((i) => "id" in i) as Bot[]

  return { inputs, bots }
}

const parseInstruction = (line: string): Input | Bot => {
  let match = line.match(/^value (\d+) goes to bot (\d+)$/)

  if (match) {
    return {
      value: parseInt(match[1]!),
      outputBot: parseInt(match[2]!),
    }
  }

  match = line.match(
    /^bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)$/
  )

  if (match) {
    return {
      id: parseInt(match[1]!),
      lowOutput: {
        type: match[2] as GiveToRuleType,
        id: parseInt(match[3]!),
      },
      highOutput: {
        type: match[4] as GiveToRuleType,
        id: parseInt(match[5]!),
      },
      inputs: [],
    }
  }

  throw new Error("Invalid instruction")
}

export const day10 = { part1, part2 }
