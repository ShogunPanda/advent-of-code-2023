import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const MIN = 200000000000000
const MAX = 400000000000000

function toEquation(stone) {
  const nextPoint = [stone[0] + stone[3], stone[1] + stone[4]]

  const m = (nextPoint[1] - stone[1]) / (nextPoint[0] - stone[0])
  const p = nextPoint[1] - (m * nextPoint[0])

  return [m, p]
}

function wasPast(stone, x, y) {
  return Math.sign(x - stone[0]) !== Math.sign(stone[3]) || Math.sign(y - stone[1]) !== Math.sign(stone[4])  
}

export async function main() {
  let sum = 0
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  const stones = input.split('\n').map(l => l.replaceAll(' ', '').split(/[@,]/).map(c => parseInt(c, 10)))

  for(let i = 0; i < stones.length; i++) {
    for(let j = i + 1; j < stones.length; j++) {
      const stoneA = stones[i]
      const stoneB = stones[j]
      
      // Find the equation for both stones
      const [mA, pA] =  toEquation(stoneA)
      const [mB, pB]  = toEquation(stoneB)

      // Parallel, ignore
      if(mA == mB) {
        continue
      }

      const x = (pB - pA) / (mA - mB)
      const y = x * mA + pA

      if(wasPast(stoneA, x, y) || wasPast(stoneB, x, y)) {
        continue
      }

      if(x > MIN && x <= MAX && y >MIN && y <= MAX) {
        sum ++
      }
    }
  }

  return sum
}
