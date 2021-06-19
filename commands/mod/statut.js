const Discord = require("discord.js")
const moment = require('moment');

const status = {
    online: "En ligne",
    idle: "Inactive",
    dnd: "Ne pas déranger",
    offline: "Hors ligne / invisible"
};

module.exports = {
    config: {
        name: "statut",
        description: "informations utilisateur",
        usage: "m/status <mention a member/member id>",
        aliases: ['ui', 'userinfo']
    },
    run: async (bot, message, args) => {
        var permissions = [];
        var acknowledgements = 'None';
        let whoisPermErr = new Discord.MessageEmbed()
        .setTitle("**Erreur de permission de l'utilisateur!**")
        .setDescription("**Désolé, vous n'avez pas d'autorisations pour l'utiliser! ❌**")

        if(!message.channel.permissionsFor(message.author).has("MANAGE_MESSAGES") ) return message.channel.send(whoisPermErr)

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        

        if(member.hasPermission("KICK_MEMBERS")){
            permissions.push("Kick Members");
        }
        
        if(member.hasPermission("BAN_MEMBERS")){
            permissions.push("Ban Members");
        }
        
        if(member.hasPermission("ADMINISTRATOR")){
            permissions.push("Administrator");
        }
    
        if(member.hasPermission("MANAGE_MESSAGES")){
            permissions.push("Manage Messages");
        }
        
        if(member.hasPermission("MANAGE_CHANNELS")){
            permissions.push("Manage Channels");
        }
        
        if(member.hasPermission("MENTION_EVERYONE")){
            permissions.push("Mention Everyone");
        }
    
        if(member.hasPermission("MANAGE_NICKNAMES")){
            permissions.push("Manage Nicknames");
        }
    
        if(member.hasPermission("MANAGE_ROLES")){
            permissions.push("Manage Roles");
        }
    
        if(member.hasPermission("MANAGE_WEBHOOKS")){
            permissions.push("Manage Webhooks");
        }
    
        if(member.hasPermission("MANAGE_EMOJIS")){
            permissions.push("Manage Emojis");
        }
    
        if(permissions.length == 0){
            permissions.push("Aucune autorisation clé trouvée");
        }
    
        if(member.user.id == message.guild.ownerID){
            acknowledgements = 'Propriétaire du serveur';
        }
    
        const embed = new Discord.MessageEmbed()
            .setDescription(`<@${member.user.id}>`)
            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL())
            .setColor('#2F3136')
            .setFooter(`ID: ${message.author.id}`)
            .setThumbnail(member.user.displayAvatarURL())
            .setTimestamp()
            .addField("__Statut__",`${status[member.user.presence.status]}`, true)
            .addField('__Rejoint à:__ ',`${moment(member.joinedAt).format("dddd, MMMM Do YYYY, HH:mm:ss")}`, true)
            .addField('__Créé le__', member.user.createdAt.toLocaleString(), true)
            .addField(`\n__Les rôles [${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `\`${roles.name}\``).length}]__`,`${member.roles.cache.filter(r => r.id !== message.guild.id).map(roles => `<@&${roles.id }>`).join(" **|** ") || "Pas de rôles"}`, true)
            .addField("\n__Remerciements:__ ", `${acknowledgements}`, true)
            .addField("\n__Autorisation:__ ", `${permissions.join(` | `)}`);
            
        message.channel.send({embed});
    
    }
    }
