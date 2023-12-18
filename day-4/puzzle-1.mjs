import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  const cardParser = /Card\s+(\d+):\s(.+)\s+\|\s+(.+)/
  let sum = 0

  for (const line of input.split('\n')) {
    const [, , rawWinning, rawOwned] = line.trim().match(cardParser)

    const winning = rawWinning
      .trim()
      .split(/\s+/)
      .map(s => parseInt(s.trim(), 10))
    const owned = rawOwned
      .trim()
      .split(/\s+/)
      .map(s => parseInt(s.trim(), 10))

    const matching = winning.filter(w => owned.includes(w)).length

    sum += matching > 0 ? Math.pow(2, matching - 1) : 0
  }

  return sum
}
