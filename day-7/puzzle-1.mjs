import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const matchers = [
  hand => /(.)\1{4}/.test(hand), // Five of a kind
  hand => /(.)\1{3}/.test(hand), // Four of a kind
  hand => /(.)\1{2}(.)\2/.test(hand) || /(.)\1(.)\2{2}/.test(hand), // Full house
  hand => /(.)\1{2}/.test(hand), // Three of a kind
  hand => /(.)\1.?(.)\2/.test(hand), // Two pair
  hand => /(.)\1/.test(hand), // One pair
  hand => true // High card
]

const types = ['five', 'four', 'full-house', 'three', 'two-pair', 'pair', 'high']

export async function main() {
  const values = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  // First of all, parse all hands and gets its cards amount
  const hands = input.split('\n').map(l => {
    const [rawHand, bid] = l.split(' ')

    // Sort the hand to enable easier matching
    const hand = rawHand
      .split('')
      .sort((a, b) => values.indexOf(b) - values.indexOf(a))
      .join('')

    const rank = matchers.findIndex(matcher => matcher(hand))
    return {
      hand: rawHand,
      type: types.length - rank,
      label: types[rank],
      bid: parseInt(bid)
    }
  })

  // Sort the hands
  hands.sort((a, b) => {
    // Different type, easy case
    if (a.type !== b.type) {
      return a.type - b.type
    }

    const aCards = a.hand.split('')
    const bCards = b.hand.split('')

    for (let i = 0; i < 5; i++) {
      if (aCards[i] !== bCards[i]) {
        return values.indexOf(aCards[i]) - values.indexOf(bCards[i])
      }
    }

    return 0
  })

  // Now sum all values
  let sum = 0
  for (let i = 0; i < hands.length; i++) {
    sum += (i + 1) * hands[i].bid
  }

  return sum
}
