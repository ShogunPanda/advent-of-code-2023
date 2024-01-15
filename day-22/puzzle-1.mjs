import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function mark(space, brick, value) {
  for(let x = brick[0][0]; x <= brick[1][0]; x++) {
    for(let y = brick[0][1]; y <= brick[1][1]; y++) {
      for(let z = brick[0][2]; z <= brick[1][2]; z++) {
        space[`${x}:${y}:${z}`] = value
      }
    }
  }
}

function neighbours(space, brick, index, z) {
  const present = new Set()
  for(let x = brick[0][0]; x <= brick[1][0]; x++) {
    for(let y = brick[0][1]; y <= brick[1][1]; y++) {
      const candidate = space[`${x}:${y}:${z}`]

      
      if(typeof candidate === 'number' && candidate !== index) {
        present.add(candidate)
      }
    }
  }

  return Array.from(present)
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  // Get all the bricks
  const bricks = input.split('\n').map(l => l.split('~').map(b => b.split(',').map(c => parseInt(c, 10))))

  // Now sort all bricks by z, ascending
  bricks.sort((a, b) => a[1][2] !== b[1][2] ? a[1][2] - b[1][2] : a[0][2] - b[0][2])
  
  // Now start by marking the entire space by blocks
  const space = {}

  for(let i = 0; i < bricks.length; i++) {
    mark(space, bricks[i], i)
  }

  // Finish the fall
  for(let i = 0; i < bricks.length; i++) {
    const brick = bricks[i]

    let movable = true
    while(movable) {
      const z = Math.min(brick[0][2], brick[1][2]) - 1

      // We have reached the ground
      if(z === 0) {
        movable = false
        break
      }

      movable = neighbours(space, brick, i, z).length === 0

      if(movable) {
        mark(space, brick, null)
        brick[0][2] --
        brick[1][2] --
        mark(space, brick, i)
      }
    }
  }

  // Check which one can be disintegrated
  let sum = 0
  for(let i = 0; i < bricks.length; i++) {
    const brick = bricks[i]
    const z = Math.max(brick[0][2], brick[1][2]) + 1
    let disintegratable = true

    // Check all neighbours of the current brick
    const aboves = neighbours(space, brick, i, z)        

    // For each neighbour, check if there is another block supporting it
    for(const above of aboves) {
      const below = neighbours(space, bricks[above], i, z - 1)

      if(below.length === 0) {
        disintegratable = false
      }
    }

    if(disintegratable) {
      sum ++
    }
  }

  return sum
}
