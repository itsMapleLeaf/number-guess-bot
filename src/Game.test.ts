import { Game } from "./Game"

test("Game", () => {
  const game = new Game()

  function play() {
    // game should do nothing when idle
    expect(game.handleCommand({ type: "guess", guess: 50 })).toBeUndefined()

    // starts game
    expect(game.handleCommand({ type: "start" })).toBe("newGame")

    // another start should do nothing
    expect(game.handleCommand({ type: "start" })).toBeUndefined()

    // does nothing with invalid guesses
    expect(game.handleCommand({ type: "guess", guess: 9999 })).toBeUndefined()
    expect(game.handleCommand({ type: "guess", guess: -50 })).toBeUndefined()
    expect(game.handleCommand({ type: "guess", guess: 0.5 })).toBeUndefined()
    expect(game.handleCommand({ type: "guess", guess: NaN })).toBeUndefined()
    expect(
      game.handleCommand({ type: "guess", guess: Infinity }),
    ).toBeUndefined()
    expect(
      game.handleCommand({ type: "guess", guess: -Infinity }),
    ).toBeUndefined()
    expect(
      game.handleCommand({ type: "guess", guess: Number.MAX_VALUE }),
    ).toBeUndefined()

    // gameplay
    let guess = 50
    while (true) {
      const result = game.handleCommand({ type: "guess", guess })
      if (result === "tooLow") {
        guess += 1
      } else if (result === "tooHigh") {
        guess -= 1
      } else if (result === "finish") {
        break
      } else {
        fail(`did not get feedback, result was "${result}"`)
      }
    }

    // does nothing with more guesses
    expect(game.handleCommand({ type: "guess", guess: 1 })).toBeUndefined()
    expect(game.handleCommand({ type: "guess", guess: 2 })).toBeUndefined()
    expect(game.handleCommand({ type: "guess", guess: 3 })).toBeUndefined()
  }

  // make sure we can play multiple times
  play()
  play()
  play()
})
