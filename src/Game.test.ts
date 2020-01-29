import { Game } from "./Game"

test("Game", () => {
  const game = new Game()

  function play() {
    // game should do nothing when idle
    expect(game.handleCommand({ type: "guess", guess: 50 })).toEqual([])

    // starts game
    expect(game.handleCommand({ type: "start" })).toContainEqual({
      type: "start",
    })
    game.start()

    // another start should do nothing
    expect(game.handleCommand({ type: "start" })).toEqual([])

    // does nothing with invalid guesses
    expect(game.handleCommand({ type: "guess", guess: 9999 })).toEqual([])
    expect(game.handleCommand({ type: "guess", guess: -50 })).toEqual([])
    expect(game.handleCommand({ type: "guess", guess: 0.5 })).toEqual([])
    expect(game.handleCommand({ type: "guess", guess: NaN })).toEqual([])
    expect(game.handleCommand({ type: "guess", guess: Infinity })).toEqual([])
    expect(game.handleCommand({ type: "guess", guess: -Infinity })).toEqual([])
    expect(
      game.handleCommand({ type: "guess", guess: Number.MAX_VALUE }),
    ).toEqual([])

    // gameplay
    let guess = 50
    while (true) {
      const results = game.handleCommand({ type: "guess", guess })
      const reply = results.find((it) => it.type === "reply") as {
        type: "reply"
        text: string
      }
      expect(reply).toBeDefined()

      if (reply.text.includes("too low")) {
        guess += 1
      } else if (reply.text.includes("too high")) {
        guess -= 1
      } else if (results.some((it) => it.type === "finish")) {
        game.finish()
        break
      } else {
        fail("did not receive appropriate game feedback")
      }
    }

    // does nothing with more guesses
    expect(game.handleCommand({ type: "guess", guess: 1 })).toEqual([])
    expect(game.handleCommand({ type: "guess", guess: 2 })).toEqual([])
    expect(game.handleCommand({ type: "guess", guess: 3 })).toEqual([])
  }

  // make sure we can play multiple times
  play()
  play()
  play()
})
