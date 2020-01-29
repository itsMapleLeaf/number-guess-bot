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
      case "message":
        message.channel.createMessage(result.text)
        break
      case "reply":
        sendWithMention(message, result.text)
        break
      case "start":
        game.start()
        break
      case "finish":
        game.finish()
        break
    }
  }

  bot.on("ready", () => console.log("ready"))

  bot.on("messageCreate", (message) => {
    const command = commandFromMessage(message)
    if (!command) return

    const results = game.handleCommand(command)
    for (const result of results) {
      runResult(result, message)
    }
  })

  return bot.connect()
}

dotenv.config()
run().catch(console.error)
