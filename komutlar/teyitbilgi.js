const Discord = require("discord.js");
const data = require("quick.db");
const moment = require("moment");

exports.run = async (client, message, args) => {

let user = message.mentions.users.first() || client.users.get(args[0]) || message.author, guild = message.guild

let manAmount = data.get(`${message.guild.id}.${user.id}.manAmount`) || 0, womanAmount = data.get(`${message.guild.id}.${user.id}.womanAmount`) || 0
let jailAmount = data.get(`${message.guild.id}.${user.id}.jailAmount`) || 0, muteAmount = data.get(`${message.guild.id}.${user.id}.muteAmount`) || 0, voiceMuteAmount = data.get(`${message.guild.id}.${user.id}.voiceMuteAmount`) || 0
moment.locale("tr")
let txt = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setAuthor(message.author.tag , message.author.avatarURL)
.setDescription(`**
\`İD:\` ${user.id}
\`Profil:\` ${user}
\`Hesap Oluşturma Tarihi:\` ${moment(message.createdAt).format('Do MMMM YYYY HH:mm')}
──────────────
• __Jail__: \`${jailAmount}\`
• __Mute__: \`${muteAmount}\` 
• __SesMute__: \`${voiceMuteAmount}\` 
──────────────
• __Erkek Kayıt__: \`${manAmount}\` 
• __Kadın Kayıt__: \`${womanAmount}\`
• __Toplam Kayıt__: \`${Number(manAmount) + Number(womanAmount)}\`
──────────────
**
  `)
.setTimestamp()
.setFooter(message.guild.name , message.guild.avatarURL)
message.channel.send(txt)

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["teyitbilgi"],
  permLevel: 0
};

exports.help = {
  name: "teyit-bilgi"
};