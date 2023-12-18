import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  const lines = input.split('\n')

  // Get the seeds first
  const seedsRange = lines[0]
    .slice(7)
    .split(/\s+/)
    .map(s => parseInt(s, 10))

  let currentKey = ''
  const maps = {}
  const sequence = []

  // Now get the maps
  for (const line of lines.slice(2)) {
    if (!line.length) {
      continue
    } else if (line.endsWith('map:')) {
      currentKey = line.replace(' map:', '')
      maps[currentKey] = []
      sequence.push(currentKey)
      continue
    }

    const [destination, sourceStart, length] = line.split(/\s+/).map(s => parseInt(s, 10))

    maps[currentKey].push({ start: sourceStart, end: sourceStart + length, destination })
  }

  // Sort all ranges so that they are ascending
  for (const value of Object.values(maps)) {
    value.sort((a, b) => a.start - b.start)
  }

  const allMappings = sequence.map(k => maps[k])

  // Go from seed to location
  let minLocation = Number.MAX_VALUE
  for (let i = 0; i < seedsRange.length - 1; i += 2) {
    for (let j = 0; j < seedsRange[i + 1]; j++) {
      let current = seedsRange[i] + j

      for (let k = 0; k < allMappings.length; k++) {
        const ranges = allMappings[k]

        // Optimization: bail out if the current variable is smaller than the smallest range or greater than the greatest value
        if (current < ranges[0].start || current > ranges[ranges.length - 1].end) {
          continue
        }

        for (let l = 0; l < ranges.length; l++) {
          const range = ranges[l]
          if (range.start <= current && current < range.end) {
            current = range.destination + (current - range.start)
            break
          }
        }
      }

      if (current < minLocation) {
        minLocation = current
      }
    }
  }

  return minLocation
}
