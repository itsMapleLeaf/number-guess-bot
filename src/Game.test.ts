import { Game, GameCommand } from "./Game"

const guessCommand = (guess: number): GameCommand => ({
  type: "guess",
  guess,
  playerId: "0",
})

test("Game", () => {
  const game = new Game()

  function play() {
    // game should do nothing when idle
    expect(game.handleCommand(guessCommand(50))).toBeUndefined()

    // starts game
    expect(game.handleCommand({ type: "start" })).toEqual({ type: "newGame" })

    // another start should do nothing
    expect(game.handleCommand({ type: "start" })).toBeUndefined()

    // does nothing with invalid guesses
    expect(game.handleCommand(guessCommand(9999))).toBeUndefined()
    expect(game.handleCommand(guessCommand(-50))).toBeUndefined()
    expect(game.handleCommand(guessCommand(0.5))).toBeUndefined()
    expect(game.handleCommand(guessCommand(NaN))).toBeUndefined()
    expect(game.handleCommand(guessCommand(Infinity))).toBeUndefined()
    expect(game.handleCommand(guessCommand(-Infinity))).toBeUndefined()
    expect(game.handleCommand(guessCommand(Number.MAX_VALUE))).toBeUndefined()

    // gameplay
    let guess = 50
    while (true) {
      const result = game.handleCommand(guessCommand(guess))
      if (result?.type === "tooLow") {
        guess += 1
      } else if (result?.type === "tooHigh") {
        guess -= 1
      } else if (result?.type === "finish") {
        break
      } else {
        fail(`did not get feedback, result was "${result}"`)
      }
    }

    // does nothing with more guesses
    expect(game.handleCommand(guessCommand(1))).toBeUndefined()
    expect(game.handleCommand(guessCommand(2))).toBeUndefined()
    expect(game.handleCommand(guessCommand(3))).toBeUndefined()
  }

  // make sure we can play multiple times
  play()
  play()
  play()
})
