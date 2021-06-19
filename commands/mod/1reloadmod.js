const Discord = require("discord.js")
const { readdirSync } = require("fs");

module.exports = {
    config: {
        name: "reload",
        description: "Reload command- Dev Only",
        aliases: ['rmod']
    },

    run: async (bot, message, args) => {

        let embed = new Discord.MessageEmbed()
        .setTitle("Recharger")
        .setDescription("Désolé, la commande `recharge` ne peut être exécutée que par le développeur.")
        .setColor("#cdf785");
        if(message.author.id !== '743101574502547557') return message.channel.send(embed);

        if(!args[0].toLowerCase()) return message.channel.send("S'il vous plaît fournir un nom de commande!")

        let commandName = args[0].toLowerCase()

        try {
          
          delete require.cache[require.resolve(`./${commandName}.js`)]
          const pull = require(`./${commandName}.js`)
          bot.commands.set(pull.config.name, pull)
          message.channel.send(`Rechargé avec succès: \`${commandName}\``)
        }

        catch (e) {
          console.log(e)
          return message.channel.send(`Impossible de recharger la commande: ${commandName} Du module de modération parce que: \n`)
        }


      }
} 