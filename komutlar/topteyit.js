const Discord = require("discord.js");
const db = require('quick.db')

exports.run = async (client, message, args) => {

let x = message.guild.members.filter(x => db.has(`${message.guild.id}.${x.id}.kayıtSorgu_`))

if(x && x.array().length == 0) {
 return message.channel.send(new Discord.RichEmbed().setAuthor(message.author.tag , message.author.avatarURL).setDescription("**Sunucuda Henüz hiç bir kayıt yapılmamış. **").setColor('RANDOM'))
} else {
let obj = []
let kaan = 0
let sorted = x.sort((a,b) => db.get(`${message.guild.id}.${b.id}.kayıtSorgu_`) - db.get(`${message.guild.id}.${a.id}.kayıtSorgu_`)).map((r,index) => `**${++kaan}. ${r.user}** - (\`${r.user.id}\`) **${db.get(`${message.guild.id}.${r.id}.kayıtSorgu_`)}** Kayıt Etmiş!`).slice(0, 10)
let Embed = new Discord.RichEmbed().
setColor(client.randomrenk())
.setTitle(`**• __Top Teyit Listesi__**`)
.setDescription(sorted)
.setImage("https://cdn.discordapp.com/attachments/768106052503470110/768588008835514408/ezgif-5-b9e5f9ec58db.gif")
.setThumbnail(message.author.avatarURL)
message.channel.send(Embed)
}

  


}

exports.conf = {
  enabled: true,
  aliases: ['top-teyit'],
  permLevel: 0
};

exports.help = {
  name: 'topteyit',
  usage: `topteyit`
}