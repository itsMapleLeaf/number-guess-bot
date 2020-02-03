import { randomRange } from "./randomRange"

export type GameCommand =
  | { type: "start"; maxNumber?: number }
  | { type: "quit" }
  | { type: "guess"; guess: number; playerId: string }

export type GameResult =
  | { type: "invalidMaxNumber" }
  | { type: "newGame"; maxNumber: number }
  | { type: "tooHigh" }
  | { type: "tooLow" }
  | { type: "finish"; guessCounts: ReadonlyMap<string, number> }
  | { type: "quit" }

type GameState = {
  handleCommand(command: GameCommand): GameResult | undefined
}

const defaultMaxNumber = 100

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
      const { maxNumber = defaultMaxNumber } = command

      const isValidMaxNumber =
        Number.isInteger(maxNumber) &&
        maxNumber >= 2 &&
        maxNumber <= 1_000_000_000

      if (!isValidMaxNumber) {
        return { type: "invalidMaxNumber" }
      }

      this.game.setState(new RunningState(this.game, maxNumber))
      return { type: "newGame", maxNumber }
    }
  }
}

class RunningState implements GameState {
  private readonly number: number
  private readonly maxNumber: number
  private readonly guessCounts = new Map<string, number>()

  constructor(private game: Game, maxNumber: number) {
    this.number = randomRange(1, maxNumber + 1)
    this.maxNumber = maxNumber
  }

  handleCommand(command: GameCommand): GameResult | undefined {
    if (command.type === "quit") {
      this.game.setState(new IdleState(this.game))
      return { type: "quit" }
    }

    if (command.type === "guess") {
      const { guess, playerId } = command
      if (!this.isValidGuess(guess)) return

      this.guessCounts.set(playerId, (this.guessCounts.get(playerId) ?? 0) + 1)

      if (guess > this.number) return { type: "tooHigh" }
      if (guess < this.number) return { type: "tooLow" }

      this.game.setState(new IdleState(this.game))
      return { type: "finish", guessCounts: this.guessCounts }
    }
  }

  private isValidGuess(guess: number) {
    return Number.isInteger(guess) && guess >= 1 && guess <= this.maxNumber
  }
}
