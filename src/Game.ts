import { randomRange } from "./randomRange"

type GameState = { type: "idle" } | { type: "running"; number: number }

export type GameCommand = { type: "start" } | { type: "guess"; guess: number }

export type GameResult = "newGame" | "tooHigh" | "tooLow" | "finish"

export class Game {
  private state: GameState = { type: "idle" }

  start() {
    this.state = { type: "running", number: randomRange(0, 100) }
  }

  finish() {
    this.state = { type: "idle" }
  }

  handleCommand(command: GameCommand): GameResult | undefined {
    switch (this.state.type) {
      case "idle":
        switch (command.type) {
          case "start":
            this.start()
            return "newGame"

          default:
            return
        }

      case "running":
        switch (command.type) {
          case "guess":
            return this.handleGuessCommand(this.state.number, command.guess)

          default:
            return
        }
    }
  }

  isValidGuess(guess: number) {
    return (
      Number.isFinite(guess) &&
      Number.isInteger(guess) &&
      guess >= 0 &&
      guess <= 100
    )
  }

  private handleGuessCommand(
    number: number,
    guess: number,
  ): GameResult | undefined {
    if (!this.isValidGuess(guess)) return

    if (guess > number) return "tooHigh"
    if (guess < number) return "tooLow"

    this.finish()
    return "finish"
  }
}
