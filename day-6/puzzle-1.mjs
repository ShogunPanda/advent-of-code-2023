import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  const [rawTimes, rawRecords] = input.split('\n')
  const times = rawTimes
    .replace('Time:', '')
    .trim()
    .split(/\s+/)
    .map(s => parseInt(s.trim(), 10))
  const records = rawRecords
    .replace('Distance:', '')
    .trim()
    .split(/\s+/)
    .map(s => parseInt(s.trim(), 10))

  let mul = 1

  for (let i = 0; i < times.length; i++) {
    const total = times[i]
    const record = records[i]

    let wins = 0
    for (let speed = 1; speed < total; speed++) {
      const distance = (total - speed) * speed

      if (distance > record) {
        wins++
      }
    }

    mul *= wins
  }

  return mul
}
