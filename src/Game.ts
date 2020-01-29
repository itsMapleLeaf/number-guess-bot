import { randomRange } from "./randomRange"

type GameState = { type: "idle" } | { type: "running"; number: number }

export type GameCommand = { type: "start" } | { type: "guess"; guess: number }

export type GameResult =
  | { type: "message"; text: string }
  | { type: "reply"; text: string }
  | { type: "start" }
  | { type: "finish" }

export class Game {
  private state: GameState = { type: "idle" }

  start() {
    this.state = { type: "running", number: randomRange(0, 100) }
  }

  finish() {
    this.state = { type: "idle" }
  }

  handleCommand(command: GameCommand): GameResult[] {
    switch (this.state.type) {
      case "idle":
        switch (command.type) {
          case "start":
            return [
              { type: "start" },
              {
                type: "message",
                text: "new game! guess a whole number from 0 to 100",
              },
            ]

          default:
            return []
        }

      case "running":
        switch (command.type) {
          case "guess":
            return this.handleGuessCommand(this.state.number, command.guess)

          default:
            return []
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

  private handleGuessCommand(number: number, guess: number): GameResult[] {
    if (!this.isValidGuess(guess)) return []

    if (guess > number) return [{ type: "reply", text: "too high" }]
    if (guess < number) return [{ type: "reply", text: "too low" }]

    return [{ type: "reply", text: "nice! u got it" }, { type: "finish" }]
  }
}
