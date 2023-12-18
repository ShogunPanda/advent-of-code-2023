import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function performVisit(queue, tiles, y, x, valid, value) {
  if (valid.includes(tiles[y]?.[x])) {
    queue.push([y, x, value + 1])
  }
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  const tiles = input.split('\n').map(l => l.split(''))

  // Find the starting point
  const initialY = tiles.findIndex(t => t.includes('S'))
  const initialX = tiles[initialY].indexOf('S')

  // Starting from S, start the journey
  const queue = [[initialY, initialX, 0]]
  const mainLoop = {}
  const visit = performVisit.bind(null, queue, tiles)

  while (queue.length) {
    const [y, x, value, override] = queue.shift()
    const key = `${y}x${x}`

    // We enqueued twice, ignore
    if (!override && typeof mainLoop[key] !== 'undefined') {
      continue
    }

    mainLoop[key] = value

    switch (override || tiles[y][x]) {
      case '|':
        // We can only go north or south
        visit(y - 1, x, ['7', '|', 'F'], value)
        visit(y + 1, x, ['J', '|', 'L'], value)
        break
      case '-':
        // We can only go left or right
        visit(y, x - 1, ['L', '-', 'F'], value)
        visit(y, x + 1, ['J', '-', '7'], value)
        break
      case 'J':
        // We can only go top or left
        visit(y - 1, x, ['7', '|', 'F'], value)
        visit(y, x - 1, ['L', '-', 'F'], value)
        break
      case 'L':
        // We can only go top or right
        visit(y - 1, x, ['7', '|', 'F'], value)
        visit(y, x + 1, ['J', '-', '7'], value)
        break
      case '7':
        // We can only go bottom or left
        visit(y + 1, x, ['J', '|', 'L'], value)
        visit(y, x - 1, ['L', '-', 'F'], value)
        break
      case 'F':
        // We can only go bottom or right
        visit(y + 1, x, ['J', '|', 'L'], value)
        visit(y, x + 1, ['J', '-', '7'], value)
        break
      case 'S':
        // To make it easier, consider S once per each type
        queue.push([y, x, 0, '|'])
        queue.push([y, x, 0, '-'])
        queue.push([y, x, 0, 'L'])
        queue.push([y, x, 0, 'J'])
        queue.push([y, x, 0, '7'])
        queue.push([y, x, 0, 'F'])
        break
    }
  }

  return Math.max(...Object.values(mainLoop))
}
