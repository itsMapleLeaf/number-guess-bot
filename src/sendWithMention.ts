import Eris from "eris"

export function sendWithMention(message: Eris.Message, text: string) {
  return message.channel.createMessage(`<@${message.author.id}> ${text}`)
}
