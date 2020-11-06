const Discord = require("discord.js"); 
const ayarlar = require("../ayarlar.json")
exports.run = async (client, message, args) => {

  if (!message.member.roles.has(ayarlar.bancı) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send()

 let uye = message.mentions.members.first()  
  if(!uye) return message.reply("Üye Etiketlemelisin");
  if(message.author.id === uye.user.id) return message.reply("Kendini Banlayamazsın!").then(msg => msg.delete(9000))

  let sebep = args.join(" ");
  if(!sebep) sebep = "Sebep Belirtilmedi.";
  message.guild.member(uye).ban(sebep);

let ban = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setAuthor(message.author.tag , message.author.avatarURL)
.setDescription(`${uye} üyesi ${message.author} tarafından **${sebep}** nedeniyle sunucudan **yasaklandı!**`)
.setImage(client.bangif())
message.channel.send(ban)



  let logt = message.guild.channels.find(c => c.id == ayarlar.banlog) 

  let embed = new Discord.RichEmbed() 
.setAuthor(message.author.tag , message.author.avatarURL)
.setColor(client.randomrenk())
.setDescription(`Banlanan Kullanıcı: ${uye} | ${uye.id} \n Banlayan Yetkili: ${message.author} | ${message.author.id}`)
.setFooter(message.author.tag, message.author.avatarURL)
logt.send(embed);


}
exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases: [],
    permLevel: 0
}

exports.help = {
    name: 'ban',
  category: 'moderasyon',
    description: 'İstediğiniz Kişiyi Banlarsınız',
    usage: '.ban'
}
