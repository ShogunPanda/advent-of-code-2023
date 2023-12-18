import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  const digits = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
  }

  let sum = 0

  for (const line of input.split('\n')) {
    const regexp = new RegExp(`(?:${Object.keys(digits).join('|')})`, 'g')
    const allDigits = []

    let found
    do {
      found = regexp.exec(line)

      if (!found) {
        break
      }

      allDigits.push(found[0])
      regexp.lastIndex = regexp.lastIndex - found[0].length + 1
    } while (found)

    const first = digits[allDigits[0]]
    const last = digits[allDigits.at(-1)]

    sum += parseInt(`${first}${last}`)
  }

  return sum
}
