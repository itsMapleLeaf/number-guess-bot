import { randomRange } from "./randomRange"

export type GameCommand =
  | { type: "start" }
  | { type: "guess"; guess: number; playerId: string }

export type GameResult =
  | { type: "newGame" }
  | { type: "tooHigh" }
  | { type: "tooLow" }
  | { type: "finish"; guessCounts: ReadonlyMap<string, number> }

type GameState = {
  handleCommand(command: GameCommand): GameResult | undefined
}

export class Game {
  private state: GameState = new IdleState(this)

  setState(state: GameState) {
    this.state = state
  }

  handleCommand(command: GameCommand): GameResult | undefined {
    return this.state.handleCommand(command)
  }
}

class IdleState implements GameState {
  constructor(private game: Game) {}

  handleCommand(command: GameCommand): GameResult | undefined {
    if (command.type === "start") {
      this.game.setState(new RunningState(this.game))
      return { type: "newGame" }
    }
  }
}

class RunningState implements GameState {
  private number = randomRange(0, 100)
  private guessCounts = new Map<string, number>()

  constructor(private game: Game) {}

  handleCommand(command: GameCommand): GameResult | undefined {
    if (command.type === "guess") {
      const { guess, playerId } = command
      if (!this.isValidGuess(guess)) return

      const currentCount = this.guessCounts.get(playerId) ?? 0

      if (guess > this.number) {
        this.guessCounts.set(playerId, currentCount + 1)
        return { type: "tooHigh" }
      }

      if (guess < this.number) {
        this.guessCounts.set(playerId, currentCount + 1)
        return { type: "tooLow" }
      }

      this.game.setState(new IdleState(this.game))
      return { type: "finish", guessCounts: this.guessCounts }
    }
  }

  private isValidGuess(guess: number) {
    return (
      Number.isFinite(guess) &&
      Number.isInteger(guess) &&
      guess >= 0 &&
      guess <= 100
    )
  }
}
