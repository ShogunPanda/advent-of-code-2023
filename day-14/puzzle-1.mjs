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

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  let matrix = input.split('\n').map(s => s.split(''))

  // Transpose the matrix so that columns are represented as array and it's easier to calculate
  matrix = transpose(matrix)
  move(matrix, ['O', '.'])
  matrix = transpose(matrix)

  return countLoad(matrix)
}
