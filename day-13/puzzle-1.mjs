import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function areEqual(a, b) {
  return a && b && a.join('') === b.join('')
}

function findReflection(rows) {
  // Find horizontal reflections
  const reflections = rows.map((c, i) => (areEqual(rows[i], rows[i + 1]) ? i : -1)).filter(r => r !== -1)

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

    sum += 100 * hReflection + vReflection
  }

  return sum
}
