import { Game, GameCommand } from "./Game"

const guessCommand = (guess: number): GameCommand => ({
  type: "guess",
  guess,
  playerId: "0",
})

const startCommand = (maxNumber: number): GameCommand => ({
  type: "start",
  maxNumber,
})

test("Game", () => {
  const game = new Game()

  function play(maxNumber = 100) {
    // game should do nothing when idle
    expect(game.handleCommand(guessCommand(50))).toBeUndefined()

    // invalid starting numbers
    const invalidNumberInputs = ["Infinity", "-Infinity", "NaN", "+0", "-0"]

    for (const input of invalidNumberInputs) {
      expect(game.handleCommand(startCommand(Number(input)))).toEqual({
        type: "invalidMaxNumber",
      })
    }

    // starts game
    expect(game.handleCommand(startCommand(maxNumber))).toEqual({
      type: "newGame",
      maxNumber,
    })

    // another start should do nothing
    expect(game.handleCommand(startCommand(maxNumber))).toBeUndefined()

    // does nothing with invalid guesses
    const invalidGuesses = [
      9999,
      -50,
      0.5,
      NaN,
      Infinity,
      -Infinity,
      Number.MAX_VALUE,
    ]

    for (const guess of invalidGuesses) {
      expect(game.handleCommand(guessCommand(guess))).toBeUndefined()
    }

    // gameplay
    let guess = Math.floor(maxNumber / 2)
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
  play(1000)
  play(5)
})
