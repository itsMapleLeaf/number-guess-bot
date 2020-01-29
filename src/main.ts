import dotenv from "dotenv"
import Eris from "eris"
import { commandFromMessage } from "./commandFromMessage"
import { Game, GameResult } from "./Game"
import { sendWithMention } from "./sendWithMention"

function run() {
  const bot = Eris(process.env.BOT_TOKEN!)
  const game = new Game()

  function runResult(result: GameResult, message: Eris.Message) {
    switch (result) {
      case "newGame":
        message.channel.createMessage(
          "new game! type a whole number from 0 to 100",
        )
        break

      case "tooHigh":
        sendWithMention(message, "too high")
        break

      case "tooLow":
        sendWithMention(message, "too low")
        break

      case "finish":
        sendWithMention(message, "nice! u got it")
        break
    }
  }

  bot.on("ready", () => console.log("ready"))

  bot.on("messageCreate", (message) => {
    const command = commandFromMessage(message)
    if (!command) return

    const result = game.handleCommand(command)
    if (result) runResult(result, message)
  })

  return bot.connect()
}

dotenv.config()
run().catch(console.error)
