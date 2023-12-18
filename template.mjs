import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
}
