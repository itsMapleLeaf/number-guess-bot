import dotenv from "dotenv"
import Eris from "eris"
import { commandFromMessage } from "./commandFromMessage"
import { Game, GameResult } from "./Game"
import { sendWithMention } from "./sendWithMention"

function run() {
  const bot = Eris(process.env.BOT_TOKEN!)
  const game = new Game()

  function runResult(result: GameResult, message: Eris.Message) {
    switch (result.type) {
      case "newGame":
        message.channel.createMessage(
          `new game! type a whole number from 1 to ${result.maxNumber}`,
        )
        break

      case "tooHigh":
        sendWithMention(message, "too high")
        break

      case "tooLow":
        sendWithMention(message, "too low")
        break

      case "finish":
        const countsDisplay = [...result.guessCounts]
          .sort(([, count1], [, count2]) => count2 - count1)
          .map(([id, count]) => `<@${id}> had ${count} guesses`)
          .join("\n")

        sendWithMention(message, `nice! u got it\n\n${countsDisplay}`)
        break

      case "invalidMaxNumber":
        sendWithMention(
          message,
          `invalid max number, must be from 2 to a billion`,
        )
        break

      default:
        console.error(`unhandled result ${result}`)
        break
    }
  }

  bot.on("ready", () => {
    bot.editStatus("binary search lol")
  })

  bot.on("messageCreate", (message) => {
    const command = commandFromMessage(message)
    if (!command) return

    const result = game.handleCommand(command)
    if (result) runResult(result, message)
  })

  bot.on("error", (error) => {
    console.error(error)
  })

  return bot.connect()
}

dotenv.config()
run().catch(console.error)
