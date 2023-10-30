import fs from "fs"

const part1 = () => {
  const ipAddresses = readIpAddresses()

  const tlsIpAddresses = ipAddresses.filter(doesSupportTls)
  console.log(tlsIpAddresses.length)
}

const doesSupportTls = (ipAddress: string): boolean => {
  const parts = ipAddress.split(/[\[\]]/)
  let valid = false

  for (let i = 0; i < parts.length; i++) {
    const isHypernetSequence = i % 2 === 1

    const containsAbba = doesContainABBA(parts[i]!)

    if (isHypernetSequence && containsAbba) {
      return false
    }

    if (!isHypernetSequence && containsAbba) {
      valid = true
    }
  }
  return valid
}

const doesContainABBA = (str: string): boolean => {
  for (let i = 0; i < str.length - 3; i++) {
    if (
      str[i] !== str[i + 1] &&
      str[i] === str[i + 3] &&
      str[i + 1] === str[i + 2]
    ) {
      return true
    }
  }
  return false
}

const part2 = () => {
  const ipAddresses = readIpAddresses()

  const sslIpAddresses = ipAddresses.filter(doesSupportSSL)
  console.log(sslIpAddresses.length)
}

const doesSupportSSL = (ipAddress: string): boolean => {
  const parts = ipAddress.split(/[\[\]]/)
  const abas: string[] = []
  const hypernetSequenceAbas: string[] = []

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]!
    const isHypernetSequence = i % 2 === 1

    if (isHypernetSequence) {
      const partABAs = getContainedABAs(part)
      hypernetSequenceAbas.push(...partABAs.map(flip))
    } else {
      const partABAs = getContainedABAs(part)
      abas.push(...partABAs)
    }
  }

  for (const aba of abas) {
    if (hypernetSequenceAbas.includes(aba)) {
      return true
    }
  }
  return false
}

const flip = (str: string): string => {
  return `${str[1]}${str[0]}`
}

const getContainedABAs = (str: string): string[] => {
  const found: string[] = []

  for (let i = 0; i < str.length - 2; i++) {
    if (str[i] !== str[i + 1] && str[i] === str[i + 2]) {
      found.push(`${str[i]}${str[i + 1]}`)
    }
  }

  return found
}

const readIpAddresses = (): string[] => {
  const filepath = new URL("./input.txt", import.meta.url).pathname
  return fs.readFileSync(filepath, "utf-8").toString().split("\n")
}

export const day07 = { part1, part2 }
