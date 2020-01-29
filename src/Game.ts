import { randomRange } from "./randomRange"

export type GameCommand = { type: "start" } | { type: "guess"; guess: number }

export type GameResult = "newGame" | "tooHigh" | "tooLow" | "finish"

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
      return "newGame"
    }
  }
}

class RunningState implements GameState {
  private number = randomRange(0, 100)

  constructor(private game: Game) {}

  handleCommand(command: GameCommand): GameResult | undefined {
    if (command.type === "guess") {
      return this.handleGuess(command.guess)
    }
  }

  private handleGuess(guess: number): GameResult | undefined {
    if (!this.isValidGuess(guess)) return

    if (guess > this.number) return "tooHigh"
    if (guess < this.number) return "tooLow"

    this.game.setState(new IdleState(this.game))
    return "finish"
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
