const { MessageEmbed } = require("discord.js");
const db = require('quick.db');

module.exports = {
    config: {
        name: "mute",
        description: "Mutes a member in the discord!",
        usage: "[name | nickname | mention | ID] <reason> (optional)",
    },
    run: async (bot, message, args) => {
        try {
            if (!message.member.hasPermission("MANAGE_GUILD")) return message.channel.send("**Vous n'avez pas les autorisations pour mute quelqu'un! - [MANAGE_GUILD]**");

            if (!message.guild.me.hasPermission("MANAGE_GUILD")) return message.channel.send("**Je n'ai pas les autorisations pour sourdiner quelqu'un! - [MANAGE_GUILD]**")
            if (!args[0]) return message.channel.send("**S'il vous plaît entrer un utilisateur à sourdine!**");

            var mutee = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(r => r.user.username.toLowerCase() === args[0].toLocaleLowerCase()) || message.guild.members.cache.find(ro => ro.displayName.toLowerCase() === args[0].toLocaleLowerCase());
            if (!mutee) return message.channel.send("**Veuillez entrer un utilisateur valide à être mis en sourdine!**");

            if (mutee === message.member) return message.channel.send("**Vous ne pouvez pas vous couper!**")
            if (mutee.roles.highest.comparePositionTo(message.guild.me.roles.highest) >= 0) return message.channel.send('**Ne peut pas couper cet utilisateur!**')

            let reason = args.slice(1).join(" ");
            if (mutee.user.bot) return message.channel.send("**Ne peut pas couper des robots!**");
            const userRoles = mutee.roles.cache
                .filter(r => r.id !== message.guild.id)
                .map(r => r.id)

            let muterole;
            let dbmute = await db.fetch(`muterole_${message.guild.id}`);
            let muteerole = message.guild.roles.cache.find(r => r.name === "mute")

            if (!message.guild.roles.cache.has(dbmute)) {
                muterole = muteerole
                
            } else {
                muterole = message.guild.roles.cache.get(dbmute)
            }


            if (!muterole) {
                try {
                    muterole = await message.guild.roles.create({
                        data: {
                            name: "mute",
                            color: "#514f48",
                            permissions: []
                        }
                    })
                    message.guild.channels.cache.forEach(async (channel) => {
                        await channel.createOverwrite(muterole, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: true,
                            SPEAK: false,
                            CONNECT: true,
                        })
                    })
                } catch (e) {
                    console.log(e);
                }
            };

            if (mutee.roles.cache.has(muterole.id)) return message.channel.send("**L'utilisateur est déjà en sourdine!**")

            db.set(`muteeid_${message.guild.id}_${mutee.id}`, userRoles)
          try {
            mutee.roles.set([muterole.id]).then(() => {
                mutee.disconnect();
                mutee.send(`**Bonjour, vous avez été mis en sourdine de ${message.guild.name} pour - ${reason || "Sans raison"}**`).catch(() => null)
            })
            } catch {
                 mutee.roles.set([muterole.id])                               
            }
                if (reason) {
                const sembed = new MessageEmbed()
                    .setColor("GREEN")
                    .setAuthor(message.guild.name, message.guild.iconURL())
                    .setDescription(`${mutee.user.username} a été mis en sourdine avec succès pour ${reason}`)
                message.channel.send(sembed);
                } else {
                    const sembed2 = new MessageEmbed()
                    .setColor("GREEN")
                    .setDescription(`${mutee.user.username} a été mis en sourdine`)
                message.channel.send(sembed2);
                }
            
            let channel = db.fetch(`modlog_${message.guild.id}`)
            if (!channel) return;

            let embed = new MessageEmbed()
                .setColor('RED')
                .setThumbnail(mutee.user.displayAvatarURL({ dynamic: true }))
                .setAuthor(`${message.guild.name} Modlogs`, message.guild.iconURL())
                .addField("**Modération**", "mute")
                .addField("**Muet**", mutee.user.username)
                .addField("**Modérer**", message.author.username)
                .addField("**Raison**", `${reason || "**Sans raison**"}`)
                .addField("**Date**", message.createdAt.toLocaleString())
                .setFooter(message.member.displayName, message.author.displayAvatarURL())
                .setTimestamp()

            var sChannel = message.guild.channels.cache.get(channel)
            if (!sChannel) return;
            sChannel.send(embed)
        } catch {
            return;
        }
    }
}