import Eris from "eris"
import { commandFromMessage } from "./commandFromMessage"
import { GameCommand } from "./Game"

test("commandFromMessage", () => {
  const playerId = "0"
  const cases: [string, GameCommand][] = [
    ["!numberguess", { type: "start" }],
    ["!numberguess ", { type: "start" }],
    ["!numberguess      ", { type: "start" }],
    ["!numberguess\twhatever", { type: "start", maxNumber: NaN }],
    ["!numberguess 1000", { type: "start", maxNumber: 1000 }],
    ["!numberguess     NaN", { type: "start", maxNumber: NaN }],
    ["!quit", { type: "quit" }],
    ["!quitt", { type: "guess", guess: NaN, playerId }],
    ["anything", { type: "guess", guess: NaN, playerId }],
    ["else", { type: "guess", guess: NaN, playerId }],
    ["is a guess", { type: "guess", guess: NaN, playerId }],
    ["Infinity", { type: "guess", guess: expect.any(Number), playerId }],
    ["-Infinity", { type: "guess", guess: expect.any(Number), playerId }],
    ["420", { type: "guess", guess: expect.any(Number), playerId }],
    ["69", { type: "guess", guess: expect.any(Number), playerId }],
    ["undefined", { type: "guess", guess: expect.any(Number), playerId }],
    [".", { type: "guess", guess: expect.any(Number), playerId }],
    ["🍆", { type: "guess", guess: expect.any(Number), playerId }],
  ]

  for (const [content, expected] of cases) {
    const command = commandFromMessage({
      content,
      author: { id: playerId },
    } as Eris.Message)

    expect(command).toEqual(expected)
  }
})
