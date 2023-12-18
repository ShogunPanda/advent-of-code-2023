import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  const [rawTimes, rawRecords] = input.split('\n')
  const total = parseInt(rawTimes.replace('Time:', '').trim().replace(/\s+/g, ''), 10)
  const record = parseInt(rawRecords.replace('Distance:', '').trim().replace(/\s+/g, ''), 10)

  let wins = 0
  for (let speed = 1; speed < total; speed++) {
    const distance = (total - speed) * speed

    if (distance > record) {
      wins++
    }
  }

  return wins
}
