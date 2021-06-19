const { ownerID } = require('../../owner.json') 

module.exports = {
    config: {
        name: "purge",
        aliases: [],
        category: "moderation",
        description: "Supprime les messages d'une chaîne",
        usage: "m/purge [amount of messages]"
    },
    run: async (bot, message, args) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("Vous n'avez pas suffisamment d'autorisations!- [MANAGE_MESSAGES]")
        if (isNaN(args[0]))
            return message.channel.send('**Veuillez fournir un montant valide pour supprimer des messages!**');

        if (args[0] > 100)
            return message.channel.send("**Veuillez fournir un numéro de moins de 100!**");

        if (args[0] < 1)
            return message.channel.send("**Veuillez fournir un nombre plus de 1!**");

        message.channel.bulkDelete(args[0])
            .then(messages => message.channel.send(`**Supprimé avec succès \`${messages.size}/${args[0]}\` messages**`).then(msg => msg.delete({ timeout: 5000 }))).catch(() => null)
    }
}