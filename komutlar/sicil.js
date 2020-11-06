let Discord = require('discord.js'), data = require('quick.db'), moment = require('moment'), x = 0
const ayarlar = require('../ayarlar.json')


exports.run = async (client, message, args) => {
moment.locale("tr")
if (!message.member.roles.has(ayarlar.jailci) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send()

let user = message.mentions.members.first() || message.guild.members.get(args[0])
if(!user) return message.channel.send('Lütfen bir kullanıcı belirt.')

let sicilData = await data.get(`${message.guild.id}.${user.id}.sicil`)
if(!data.has(`${message.guild.id}.${user.id}.sicil`)) return message.channel.send(`Belirttiğiniz kullanıcıya ait bir sabıka geçmişi bulunmuyor.`)

let sabıkalar = await sicilData.map((kaan, index) => `${++x} \`•\` ${user} kullanıcısı, ${moment(kaan.tarih).fromNow()} tarihinde \`${kaan.sebep}\` sebebi yüzünden ${kaan.tip} yemiş.`).join('\n')

let text = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setAuthor(user.user.username, user.user.avatarURL)
.setDescription(`
Belirttiğiniz kullanıcıya ait ${sicilData.length} adet sabıka bulundu!

${sabıkalar}
  `)

message.channel.send(text)
};
exports.conf = {
  guildOnly : false,
  enabled : true,
  aliases : [],
  permLevel : 0,
}
exports.help = {
  name : "sicil"
}
