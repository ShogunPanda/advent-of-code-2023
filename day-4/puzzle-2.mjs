import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

function computeCard(cards, i) {
  const card = cards[i]

  if (card.matching === 0) {
    return
  }

  for (let j = 1; j <= card.matching; j++) {
    if (cards[i + j]) {
      cards[i + j].count++
      computeCard(cards, i + j)
    }
  }
}

export async function main() {
  const input = await readFile(fileURLToPath(new URL('./input.txt', import.meta.url)), 'utf-8')
  const cardParser = /Card\s+(\d+):\s(.+)\s+\|\s+(.+)/

  // Build the deck of cards
  const cards = []

  for (const line of input.split('\n')) {
    const [, rawId, rawWinning, rawOwned] = line.trim().match(cardParser)

    const winning = rawWinning
      .trim()
      .split(/\s+/)
      .map(s => parseInt(s.trim(), 10))
    const owned = rawOwned
      .trim()
      .split(/\s+/)
      .map(s => parseInt(s.trim(), 10))

    const matching = winning.filter(w => owned.includes(w)).length

    const id = parseInt(rawId.trim(), 10)
    cards.push({ id, winning, owned, matching, count: 1 })
  }

  // Start counting
  for (let i = 0; i < cards.length; i++) {
    computeCard(cards, i)
  }

  return cards.reduce((accu, c) => accu + c.count, 0)
}
