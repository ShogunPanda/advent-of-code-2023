import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  const series = input.split('\n').map(l => l.split(/\s/).map(n => parseInt(n.trim(), 10)))

  let sum = 0
  for (const serie of series) {
    const sequence = [serie]

    while (sequence.at(-1).some(d => d !== 0)) {
      const differences = []
      const last = sequence.at(-1)
      for (let i = 1; i < last.length; i++) {
        differences.push(last[i] - last[i - 1])
      }

      sequence.push(differences)
    }

    for (let i = sequence.length - 2; i >= 0; i--) {
      sequence[i].push(sequence[i].at(-1) + sequence[i + 1].at(-1))
    }

    sum += sequence[0].at(-1)
  }

  return sum
}
