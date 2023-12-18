import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function hash(command) {
  let current = 0

  for (let i = 0; i < command.length; i++) {
    current += command.charCodeAt(i)
    current *= 17
    current = current % 256
  }

  return current
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let sum = 0

  const sequences = input.trim().replaceAll('\n', ',').split(',')

  for (const sequence of sequences) {
    sum += hash(sequence)
  }

  return sum
}
