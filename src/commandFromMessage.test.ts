import Eris from "eris"
import { commandFromMessage } from "./commandFromMessage"
import { GameCommand } from "./Game"

test("commandFromMessage", () => {
  const cases: [string, GameCommand][] = [
    ["!start", { type: "start" }],
    ["!start ", { type: "start" }],
    ["!start      ", { type: "start" }],
    ["!start\twhatever", { type: "start" }],
    ["anything", { type: "guess", guess: NaN }],
    ["else", { type: "guess", guess: NaN }],
    ["is a guess", { type: "guess", guess: NaN }],
    ["Infinity", { type: "guess", guess: expect.any(Number) }],
    ["-Infinity", { type: "guess", guess: expect.any(Number) }],
    ["420", { type: "guess", guess: expect.any(Number) }],
    ["69", { type: "guess", guess: expect.any(Number) }],
    ["undefined", { type: "guess", guess: expect.any(Number) }],
    [".", { type: "guess", guess: expect.any(Number) }],
    ["🍆", { type: "guess", guess: expect.any(Number) }],
  ]

  for (const [content, expected] of cases) {
    expect(commandFromMessage({ content } as Eris.Message)).toEqual(expected)
  }
})
