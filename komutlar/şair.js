const Discord = require('discord.js');
const ayarlar = require("../ayarlar.json");
exports.run = async(client, message, args, ops, member) => {
  
if(!message.member.roles.get(ayarlar.yetenekverici) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send()

   let vUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

if(vUser) return message.channel.send(new Discord.RichEmbed().setColor(client.randomrenk().setAuthor(message.author.tag , message.author.avatarURL).setDescription(`Geçerli bir üye berlirtmelisin!`)))


let embed = new Discord.RichEmbed()
.setAuthor(message.author.tag , message.author.avatarURL)
.setDescription(`${vUser} Başarı İle **Şair** Rolü Verildi!`)
.setTimestamp()
.setFooter(message.author.tag , message.author.avatarURL)
vUser.addRole(ayarlar.şair)



}

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
};

exports.help = {
  name: 'şair',
  description: 'Kullanıcı İçin Doğrulandı Rolünü Verir.',
  usage: 'erkek'
};