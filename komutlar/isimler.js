const Discord = require('discord.js');
const ayarlar = require("../ayarlar.json")
const data = require("quick.db")
const moment = require("moment")
exports.run = async(client, message, args) => {
    let uye = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
if(!uye) return message.channel.send(new Discord.RichEmbed().setAuthor(message.author.tag , message.author.avatarURL).setDescription(`Geçerli Bir Üye Bulmalısın!`))

let veri = data.get(`${message.guild.id}.${uye.id}.isimler`)
let yeniVeri = veri.map(x => x).join('\n')
moment.locale("tr")
let embed = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setAuthor(message.author.tag , message.author.avatarURL)
.setDescription(`
\`İD:\` ${member.id}
\`Profil:\` ${member}
\`Sunucuya Katılış Tarihi:\` ${moment(uye.joiedAt).fromNow()}

\`•\` **Sunucuda Daha Önce Kayıt Olduğu İsimler;**
${yeniVeri} 

`)
message.channel.send(embed)

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["nick"],
  permLevel: 0
};

exports.help = { 
  name: 'isimler', 
  description: 'Yetkilileri Çeker',
  usage: 'yetkilicek',
  kategori: 'yetkili'
};