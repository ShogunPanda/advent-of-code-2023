import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function visit(spaces, energized, y, x, yDirection, xDirection) {
  // Out of bounds, finish
  if (y < 0 || x < 0 || y === spaces.length || x === spaces[0].length) {
    return
  }

  const spaceKey = `${y}x${x}`
  const directionKey = `${yDirection}x${xDirection}`

  // The space has already been energized and the beam was already going in this direction, bail out
  if (energized[spaceKey] === directionKey) {
    return
  } else {
    energized[spaceKey] = directionKey
  }

  // Simplification, assume the cell is a '.' when we encounter a splitter in its pointy end
  let space = spaces[y][x]

  if ((space === '-' && yDirection === 0) || (space === '|' && xDirection === 0)) {
    space = '.'
  }

  switch (space) {
    case '.':
      visit(spaces, energized, y + yDirection, x + xDirection, yDirection, xDirection)
      break
    case '/':
      if (xDirection !== 0) {
        visit(spaces, energized, y - xDirection, x, -xDirection, 0)
      } else {
        visit(spaces, energized, y, x - yDirection, 0, -yDirection)
      }

      break
    case '\\':
      if (xDirection !== 0) {
        visit(spaces, energized, y + xDirection, x, xDirection, 0)
      } else {
        visit(spaces, energized, y, x + yDirection, 0, yDirection)
      }
      break
    case '|':
      // We split in two vertically
      visit(spaces, energized, y - 1, x, -1, 0)
      visit(spaces, energized, y + 1, x, 1, 0)
      break
    case '-':
      // We split in two vertically
      visit(spaces, energized, y, x - 1, 0, -1)
      visit(spaces, energized, y, x + 1, 0, 1)
      break
  }
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let max = 0

  const spaces = input.split('\n').map(s => s.split(''))

  let energized = {}

  // Try from the left row or right row
  for (let i = 0; i < spaces.length; i++) {
    energized = {}
    visit(spaces, energized, i, 0, 0, 1)
    max = Math.max(max, Object.keys(energized).length)

    energized = {}
    visit(spaces, energized, i, spaces.length - 1, 0, -1)
    max = Math.max(max, Object.keys(energized).length)
  }

  // Try from the top or bottom row
  for (let i = 0; i < spaces[0].length; i++) {
    energized = {}
    visit(spaces, energized, 0, i, 1, 0)
    max = Math.max(max, Object.keys(energized).length)

    energized = {}
    visit(spaces, energized, spaces.length - 1, i, -1, 0)
    max = Math.max(max, Object.keys(energized).length)
  }

  return max
}
