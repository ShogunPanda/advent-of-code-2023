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

  const boxes = Array.from(Array(256), () => ({}))

  // Arrange boxes
  for (const sequence of sequences) {
    const isAdd = sequence.at(-2) === '='
    const label = sequence.slice(0, sequence.length - (isAdd ? 2 : 1))
    const box = hash(label)
    const focal = isAdd ? parseInt(sequence.at(-1), 10) : -1

    if (isAdd) {
      boxes[box][label] = focal
    } else {
      delete boxes[box][label]
    }
  }

  // Now make the overall count
  for (let box = 0; box < 256; box++) {
    const slots = Object.values(boxes[box])

    for (let slot = 0; slot < slots.length; slot++) {
      sum += (box + 1) * (slot + 1) * slots[slot]
    }
  }

  return sum
}
