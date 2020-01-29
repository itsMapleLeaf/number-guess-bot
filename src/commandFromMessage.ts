import Eris from "eris"
import { GameCommand } from "./Game"

export function commandFromMessage(
  message: Eris.Message,
): GameCommand | undefined {
  const parts = message.content.split(/\s+/)
  if (parts[0] === "!start") {
    return { type: "start" }
  }

  return { type: "guess", guess: Number(parts[0]), playerId: message.author.id }
}
