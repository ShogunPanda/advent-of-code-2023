import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function gcd(a, b) {
  // Compute the gcd first - https://en.wikipedia.org/wiki/Euclidean_algorithm
  while (b !== 0) {
    const t = b
    b = a % b
    a = t
  }

  return a
}

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

  const starting = Object.keys(nodes).filter(n => n.endsWith('A'))

  // Find the different steps to reach each final node
  const allSteps = []
  for (let i = 0; i < starting.length; i++) {
    let current = starting[i]
    let steps = 0
    while (!current.endsWith('Z')) {
      // Take the next
      const nextDirection = steps++ % allDirections

      current = nodes[current][directions[nextDirection]]
    }

    allSteps.push(steps)
  }

  // Now compute the LCM for allSteps, which is our final number of steps
  let current = allSteps[0]

  for (let i = 1; i < allSteps.length; i++) {
    current = (allSteps[i] * current) / gcd(allSteps[i], current)
    allSteps[i], current, gcd(allSteps[i], current)
  }

  return current
}
