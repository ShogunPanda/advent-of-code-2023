import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function transpose(source) {
  const destination = []

  for (let i = 0; i < source[0].length; i++) {
    destination.push(source.map(p => p[i]))
  }

  return destination
}

function move(matrix, order) {
  for (let i = 0; i < matrix.length; i++) {
    // Check
    let index
    do {
      index = matrix[i].findIndex((c, j) => c === order[1] && matrix[i][j + 1] === order[0])

      if (index !== -1) {
        matrix[i][index] = order[0]
        matrix[i][index + 1] = order[1]
      }
    } while (index !== -1)
  }
}

function countLoad(matrix) {
  const transposed = transpose(matrix)

  let sum = 0
  const totalRows = transposed[0].length
  for (let i = 0; i < transposed.length; i++) {
    for (let j = 0; j < transposed[0].length; j++) {
      if (transposed[i][j] === 'O') {
        sum += totalRows - j
      }
    }
  }

  return sum
}

function cycle(matrix) {
  // First of all, to move north, we transpose
  matrix = transpose(matrix)
  move(matrix, ['O', '.'])

  // Now, to move west, we transpose again
  matrix = transpose(matrix)
  move(matrix, ['O', '.'])

  // Now, to move south, we transpose again, then reverse each row
  matrix = transpose(matrix)
  move(matrix, ['.', 'O'])

  // Finally, we transpose again to move east
  matrix = transpose(matrix)
  move(matrix, ['.', 'O'])

  return matrix
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let matrix = input.split('\n').map(s => s.split(''))

  matrix = transpose(matrix)
  move(matrix, ['O', '.'])
  matrix = transpose(matrix)

  // Since we know there are probably loops, let's find its characteristic and then only compute left iterations
  const cache = {}
  const maximumCycles = 1e9
  let cycleToCompute = 0

  for (let i = 1; i <= maximumCycles; i++) {
    matrix = cycle(matrix)
    const key = matrix.flat(10).join('')

    if (!cache[key]) {
      cache[key] = i
      continue
    }

    // We found the loop. Get the loop characteristic
    const loopSize = i - cache[key]
    const loopOffset = i - loopSize

    console.log(loopOffset, loopSize)

    // Now compute how many
    const remaining = maximumCycles - i
    const loopRemaining = Math.floor((maximumCycles - i) / loopSize) * loopSize
    cycleToCompute = remaining - loopRemaining
    break
  }

  // Now check how many times we have to repeat the loop after the cycles
  for (let i = 0; i < cycleToCompute; i++) {
    matrix = cycle(matrix)
  }

  return countLoad(matrix)
}
