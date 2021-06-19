const { ownerID } = require('../../owner.json') 

module.exports = {
    config: {
      name: "dm",
      description: "DM un utilisateur ",
      aliases: ['pm']
    },
    run: async (bot, message, args) => {
        
        if(!message.channel.permissionsFor(message.member).has("ADMINISTRATOR") && !ownerID.includes(message.author.id)) return;


      let user =
        message.mentions.members.first() ||
        message.guild.members.cache.get(args[0]);
      if (!user)
        return message.channel.send(
          `Vous n'avez pas mentionné un utilisateur ou vous avez donné un identifiant invalide`
        );
      if (!args.slice(1).join(" "))
        return message.channel.send("Vous n'avez pas spécifié votre message");
      user.user
        .send(args.slice(1).join(" "))
        .catch(() => message.channel.send("Cet utilisateur n'a pas pu être dm!"))
        .then(() => message.channel.send(`Envoyé un message à ${user.user.tag}`));
    },
  };