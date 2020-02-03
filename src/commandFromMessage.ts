import Eris from "eris"
import { GameCommand } from "./Game"

export function commandFromMessage(
  message: Eris.Message,
): GameCommand | undefined {
  const parts = message.content.match(/\S+/g) || []
  if (parts[0] === "!numberguess") {
    return { type: "start", maxNumber: parts[1] ? Number(parts[1]) : undefined }
  }

  if (parts[0] === "!quit") {
    return { type: "quit" }
  }

  return { type: "guess", guess: Number(parts[0]), playerId: message.author.id }
}
