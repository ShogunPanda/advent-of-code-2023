import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let sum = 0

  for (const line of input.split('\n')) {
    const matches = [...line.matchAll(/\d/g)]
    const first = matches[0][0]
    const last = matches.at(-1)[0]

    sum += parseInt(`${first}${last}`)
  }

  return sum
}
