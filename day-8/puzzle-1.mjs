import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  const lines = input.split('\n')

  const directions = lines[0].split('').map(l => (l === 'L' ? 0 : 1))
  const allDirections = directions.length

  const nodes = Object.fromEntries(
    lines.slice(2).map(line => {
      const [, name, left, right] = line.match(/(.+) = \((.+), (.+)\)/)
      return [name, [left, right]]
    })
  )

  let current = 'AAA'
  let steps = 0
  while (current !== 'ZZZ') {
    // Take the next
    const nextDirection = steps++ % allDirections

    current = nodes[current][directions[nextDirection]]
  }

  return steps
}
