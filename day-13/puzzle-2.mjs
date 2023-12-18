import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function areEqual(a, b) {
  return a && b && a.join('') === b.join('')
}

function findReflection(rows, original) {
  // Find horizontal reflections
  const reflections = rows
    .map((c, i) => (areEqual(rows[i], rows[i + 1]) ? i : -1))
    .filter(r => r !== original - 1 && r !== -1)

  for (const reflection of reflections) {
    let top = reflection
    let bottom = reflection + 1
    let valid = true
    do {
      if (!areEqual(rows[top], rows[bottom])) {
        valid = false
        break
      }

      top--
      bottom++
    } while (top >= 0 && bottom < rows.length)

    if (valid) {
      return reflection + 1
    }
  }

  return 0
}

function findReflectionWithSmudging(rows, original) {
  // Now try smudging with brute forcing
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      const smudgedRows = rows.map(r => r.slice())

      smudgedRows[i][j] = smudgedRows[i][j] === '.' ? '#' : '.'

      const candidate = findReflection(smudgedRows, original)

      if (candidate > 0 && candidate !== original) {
        return candidate
      }
    }
  }

  // If we couldn't find anything different, don't count it
  return 0
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let sum = 0

  const glasses = input.split('\n\n')

  for (const glass of glasses) {
    const rows = glass.split('\n').map(r => r.split(''))
    const cols = []

    for (let i = 0; i < rows[0].length; i++) {
      cols.push(rows.map(r => r[i]))
    }

    const hReflection = findReflection(rows)
    const vReflection = findReflection(cols)
    const hReflectionSmudged = findReflectionWithSmudging(rows, hReflection)
    const vReflectionSmudged = findReflectionWithSmudging(cols, vReflection)

    sum += 100 * hReflectionSmudged + vReflectionSmudged
  }

  return sum
}
