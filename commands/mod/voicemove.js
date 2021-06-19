const { ownerID } = require("../../owner.json")

module.exports = {
    config: {
    
        name: "voicemove",
        description: "moves a member in from one voice channel to another",
        usage: "voicemove <user> <channel>",
       
    },

    run: async(bot, message, args) => {
         if (!message.member.hasPermission("MOVE_MEMBERS") && !ownerID .includes(message.author.id)) return message.channel.send("**Vous n'avez pas les autorisations pour interdire les utilisateurs! - [MOVE_MEMBERS]**");
        
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase());

        if(!member) return message.channel.send("Impossible de trouver l'utilisateur mentionné dans cette vocal.")

        let channel = message.mentions.channels.first() || bot.guilds.cache.get(message.guild.id).channels.cache.get(args[1]) || message.guild.channels.cache.find(c => c.name.toLowerCase() === args.slice(1).join(' ').toLocaleLowerCase());
        if (!channel.type === "voice") return message.channel.send("Impossible de localiser le canal vocal.Assurez-vous de mentionner un canal vocal et non un canal de texte!") 

        try {
            member.voice.setChannel(channel);
            message.channel.send("Succès ✅ : Membre déménagé!")
        } 
        
        catch(error) {
            console.log(error);
            message.channel.send("Oops!Une erreur inconnue est survenue.Veuillez réessayer plus tard.")
        }

    }
}