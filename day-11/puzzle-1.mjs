import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  const universe = input.split('\n').map(l => l.split(''))

  // Find which rows or cols cause an expansion
  const emptyRows = []
  const emptyCols = []
  for (let y = 0; y < universe.length; y++) {
    if (universe[y].every(x => x === '.')) {
      emptyRows.push(y)
    }
  }

  for (let x = 0; x < universe[0].length; x++) {
    if (universe.every(u => u[x] === '.')) {
      emptyCols.push(x)
    }
  }

  // Now find all stars
  const stars = []
  for (let y = 0; y < universe.length; y++) {
    for (let x = 0; x < universe[0].length; x++) {
      if (universe[y][x] !== '.') {
        stars.push([y, x])
      }
    }
  }

  // Now compute all paths
  let shortest = 0
  for (let i = 0; i < stars.length; i++) {
    for (let j = i + 1; j < stars.length; j++) {
      let [y1, x1] = stars[i]
      let [y2, x2] = stars[j]

      // For convenience, sort coordinates
      ;[y1, y2] = [y1, y2].sort((a, b) => a - b)
      ;[x1, x2] = [x1, x2].sort((a, b) => a - b)

      // This is the distance without counting expansions
      shortest += y2 - y1 + x2 - x1

      // Each encountered expansion increases the path length of 1
      const yExpansion = emptyRows.filter(r => r > y1 && r < y2).length
      const xExpansion = emptyCols.filter(r => r > x1 && r < x2).length
      shortest += yExpansion + xExpansion
    }
  }

  return shortest
}
