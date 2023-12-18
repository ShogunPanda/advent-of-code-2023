import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function hasAdjacentSymbol(line, start, end) {
  if (!line) {
    return false
  }

  return line.some(([symbol, symbolIndex]) => start - 1 <= symbolIndex && symbolIndex <= end)
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let sum = 0

  const lines = input.split('\n')

  // Extract all numbers in all lines
  const linesNumbers = []
  const linesSymbols = []

  for (const line of lines) {
    linesNumbers.push([...line.matchAll(/\d+/g)].map(m => [m[0], m.index]))
    linesSymbols.push([...line.matchAll(/[^\d.]/g)].map(m => [m[0], m.index]))
  }

  // Now, for each number in each line
  for (let i = 0; i < linesNumbers.length; i++) {
    for (const [number, start] of linesNumbers[i]) {
      const end = start + number.length

      // Check if the number is valid in the previous, current or next row
      const valid =
        hasAdjacentSymbol(linesSymbols[i - 1], start, end) ||
        hasAdjacentSymbol(linesSymbols[i], start, end) ||
        hasAdjacentSymbol(linesSymbols[i + 1], start, end)

      if (valid) {
        sum += parseInt(number, 10)
      }
    }
  }

  return sum
}
