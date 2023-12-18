import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function singleKindMatcher(hand, jCount, jMax) {
  return jCount === jMax || new RegExp(`(?:J{${jCount}})?([^J])\\1{${jMax - jCount - 1}}(?:J{${jCount}})?`).test(hand)
}

const matchers = [
  (hand, jCount) => singleKindMatcher(hand, jCount, 5), // Five of a kind
  (hand, jCount) => singleKindMatcher(hand, jCount, 4), // Four of a kind
  (hand, jCount) => /(.)\1{2}(.)\2/.test(hand) || /(.)\1(.)\2{2}/.test(hand) || /(.)\1(.)\2J/.test(hand), // Full house
  (hand, jCount) => singleKindMatcher(hand, jCount, 3), // Three of a kind
  (hand, jCount) => /(.)\1.?(.)\2/.test(hand) || /(.)\1(.).J/.test(hand) || /(.).(.)\2J/.test(hand), // Two pair
  (hand, jCount) => singleKindMatcher(hand, jCount, 2), // One pair
  (hand, jCount) => true // High card
]

const types = ['five', 'four', 'full-house', 'three', 'two-pair', 'pair', 'high']

export async function main() {
  const values = ['J', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'Q', 'K', 'A']
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')

  // First of all, parse all hands and gets its cards amount
  const hands = input.split('\n').map(l => {
    const [rawHand, bid] = l.split(' ')

    // Sort the hand to enable easier matching
    const hand = rawHand
      .split('')
      .sort((a, b) => values.indexOf(b) - values.indexOf(a))
      .join('')

    // Also count the number of J, needed to create a proper parser
    const js = hand.match(/J+$/)?.[0].length ?? 0
    const rank = matchers.findIndex(matcher => matcher(hand, js))

    return {
      hand: rawHand,
      sorted: hand,
      js,
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
