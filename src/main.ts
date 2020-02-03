import { Bot, Command, commandName, matchStatus } from "@crawron/griffon"
import "dotenv/config"
import Eris from "eris"
import { Game, GameCommand } from "./Game"
import { sendWithMention } from "./sendWithMention"

const game = new Game()

function parseArgs(argString: string) {
  return argString.match(/\S+/g) || []
}

function runCommand(command: GameCommand, message: Eris.Message) {
  const result = game.handleCommand(command)
  switch (result?.type) {
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

    case "quit":
      message.channel.createMessage("game has been stopped :(")
      break

    case undefined:
      break

    default:
      console.error(`unhandled result ${result}`)
      break
  }
}

const startCommand: Command = {
  condition: commandName("numberguess"),
  action: (ctx) => {
    const args = parseArgs(ctx.args)
    runCommand(
      { type: "start", maxNumber: Number(args[0]) || 100 },
      ctx.message,
    )
  },
}

const quitCommand: Command = {
  condition: commandName("quit"),
  action: (ctx) => {
    runCommand({ type: "quit" }, ctx.message)
  },
}

const guessCommand: Command = {
  condition: matchStatus("match"),
  action: (ctx) => {
    runCommand(
      {
        type: "guess",
        guess: Number(ctx.args.trim()),
        playerId: ctx.message.author.id,
      },
      ctx.message,
    )
  },
}

const prefixedCommands = {
  condition: commandName("!"),
  childCommands: [startCommand, quitCommand],
}

const bot = new Bot({
  token: process.env.BOT_TOKEN!,
  command: {
    condition: matchStatus("match"),
    childCommands: [prefixedCommands, guessCommand],
  },
})

bot.client.on("ready", () => {
  bot.client.editStatus("online", {
    name: "!numberguess <max>",
    type: 2,
  })
})

bot.client.on("error", (error) => {
  console.error(error)
})

bot.connect().catch(console.error)
