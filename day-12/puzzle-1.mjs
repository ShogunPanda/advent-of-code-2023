import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function calculate(spring, pattern) {
  if (!spring.length) {
    return 0
  }

  let configurations = 0

  if (spring[0] === '.') {
    return calculate(spring.slice(1), pattern)
  } else if (spring[0] === '?') {
    configurations += calculate(spring.slice(1), pattern)
    spring = spring.replace(/^\?/, '#')
  }

  const leading = spring.match(/(^[#?]+)/)

  // Mismatching group, continue
  if (leading[0].length < pattern[0] || spring[pattern[0]] === '#') {
    return configurations
  }

  const next = spring.slice(pattern[0])
  const nextPattern = pattern.slice(1)

  // No more group
  if (nextPattern.length === 0) {
    // No more damages found and none expected, we got a match
    if (!next.includes('#')) {
      configurations++
    }
  } else if (next.includes('#') || next.includes('?')) {
    // We expected more damages and we have more, continue
    configurations += calculate(next.replace(/^\?/, '.'), nextPattern)
  }

  return configurations
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let configurations = 0

  const rows = input.split('\n')

  for (const row of rows) {
    // Parse the row
    const [springs, rawPattern] = row.split(' ')
    const pattern = rawPattern.split(',').map(p => parseInt(p, 10))
    const currentConfigurations = calculate(springs, pattern)
    configurations += currentConfigurations
  }

  return configurations
}
