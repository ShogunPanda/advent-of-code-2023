import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  const gameParser = /Game (\d+): (.+)/
  let sum = 0

  for (const line of input.split('\n')) {
    const [, , rawSets] = line.trim().match(gameParser)

    const sets = rawSets.split(/\s*;\s*/).map(set => {
      return {
        red: 0,
        green: 0,
        blue: 0,
        ...Object.fromEntries(
          set
            .split(/\s*,\s*/)
            .map(value => value.split(' ').reverse())
            .map(v => [v[0], parseInt(v[1])])
        )
      }
    })

    const maxRed = Math.max(...sets.map(s => s.red))
    const maxGreen = Math.max(...sets.map(s => s.green))
    const maxBlue = Math.max(...sets.map(s => s.blue))

    sum += maxRed * maxGreen * maxBlue
  }

  return sum
}
