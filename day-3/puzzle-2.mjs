import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function findNumbers(line, starIndex) {
  if (!line) {
    return false
  }

  return line
    .filter(([number, start]) => {
      const end = start + number.length
      return start - 1 <= starIndex && starIndex <= end
    })
    .map(l => l[0])
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let sum = 0

  const lines = input.split('\n')

  // Extract all numbers in all lines
  const linesNumbers = []
  const linesStars = []

  for (const line of lines) {
    linesNumbers.push([...line.matchAll(/\d+/g)].map(m => [m[0], m.index]))
    linesStars.push([...line.matchAll(/\*/g)].map(m => m.index))
  }

  // Now, for each number in each line
  for (let i = 0; i < linesStars.length; i++) {
    for (const starIndex of linesStars[i]) {
      const numbers = [
        ...findNumbers(linesNumbers[i - 1], starIndex),
        ...findNumbers(linesNumbers[i], starIndex),
        ...findNumbers(linesNumbers[i + 1], starIndex)
      ]

      if (numbers.length === 2) {
        sum += parseInt(numbers[0], 10) * parseInt(numbers[1], 10)
      }
    }
  }

  return sum
}
