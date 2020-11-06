const Discord = require('discord.js');
const db = require("quick.db")
const moment = require("moment")
const ayarlar = require('../ayarlar.json')
exports.run = async function (client, message, args) {

    if (!message.member.roles.has(ayarlar.jailci) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send()
  let kullanıcı = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
  if (!kullanıcı) return message.channel.sendEmbed(new Discord.RichEmbed().setAuthor(message.author.tag ,message.author.avatarURL).setDescription('Kullanıcıyı Etiketle Veya id İle İşlem Yap.').setColor("RANDOM"));

  let member = message.guild.member(kullanıcı)
let jailid = await db.fetch('id')
 let reason = args.slice(1).join(" ")
      if(!reason) return message.channel.send(new Discord.RichEmbed().setAuthor(message.author.tag, message.author.avatarURL).setDescription(`Geçerli Bir Sebep Girmelisin`)).then(m => m.delete(5000));

      const kanal = message.guild.channels.find(c => c.id == ayarlar.jlog) 
    
let embed = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setAuthor(message.author.tag, message.author.avatarURL)
.setDescription(`**${kullanıcı} adlı üyenin jaili Açıldı Sebep: ${reason} (#${jailid-(-1)})**`)
message.channel.send(embed)


kullanıcı.removeRole(ayarlar.ceza)
kullanıcı.addRole(ayarlar.kayıtsız)
kullanıcı.removeRole(ayarlar.tehlikelihesap)

console.log(`${kullanıcı} Rolleri Alındı ${kayıtsız.id} Rolü verildi`)
db.set(`jail_${message.guild.id}_${kullanıcı.id}` , 'var')     
db.add('id',1)



}

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  kategori: "Yetkili Komutları",
  permLevel: 0
}
exports.help = {
  name: 'unjail',
  description: "Etiketlenen kişinin tüm rollerini alıp jail'e atar.",
  usage: '!jail @etiket Sebebe'
}