import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function calculate(cache, spring, pattern) {
  const key = `${spring}@${pattern.join(',')}`

  if (typeof cache[key] !== 'undefined') {
    return cache[key]
  }

  if (!spring.length) {
    return 0
  }

  let configurations = 0

  if (spring[0] === '.') {
    return calculate(cache, spring.slice(1), pattern)
  } else if (spring[0] === '?') {
    configurations += calculate(cache, spring.slice(1), pattern)
    spring = spring.replace(/^\?/, '#')
  }

  const leading = spring.match(/(^[#?]+)/)

  // Mismatching group, continue
  if (leading[0].length < pattern[0] || spring[pattern[0]] === '#') {
    cache[key] = configurations
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
    configurations += calculate(cache, next.replace(/^\?/, '.'), nextPattern)
  }

  cache[key] = configurations
  return configurations
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let configurations = 0

  const rows = input.split('\n')

  const cache = {}

  for (const row of rows) {
    // Parse the row
    let [springs, rawPattern] = row.split(' ')
    springs = Array.from(Array(5), () => springs).join('?')
    rawPattern = Array.from(Array(5), () => rawPattern).join(',')
    const pattern = rawPattern.split(',').map(p => parseInt(p, 10))

    const currentConfigurations = calculate(cache, springs, pattern)
    configurations += currentConfigurations
  }

  return configurations
}
