const Discord = require('discord.js');
const ayarlar = require("../ayarlar.json");
exports.run = async(client, message, args, prefix, ayar, emoji) => {

    const voiceChannels = message.guild.channels.filter(c => c.type === "voice");
    let count = 0;
    for (const [id, voiceChannel] of voiceChannels)
      count += voiceChannel.members.size;

  let enAltYetkiliRolü = message.guild.roles.get(ayarlar.enaltyetki); // EN ALT YETKİLİ ROLÜNÜN IDSİ
  let kaan = 0
    if (!message.member.roles.has(ayarlar.sahip) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send()
  let yetkililer = message.guild.members.filter(uye => uye.highestRole.position >= enAltYetkiliRolü.position && !uye.voiceChannel && !uye.user.bot && uye.presence.status !== "offline");
let embed = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setTitle("• Yetkili Sistemi")
.setDescription(`${message.guild.name} adlı sunucunun toplam seste **${count}** Kişi Bulunmaktadır.`)
.addField("Toplam Seste Olmayan Yetkili Sayısı:",`${yetkili.size}`)
.addField("Toplam Seste Olmayan Yetkililer:",`${yetkilil.map(z => z).join(`\n`)}`)
message.channel.send(embed)

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = { 
  name: 'ytsay', 
  description: 'Seste olmayan yetkilileri gösterir.',
  usage: 'yetkilisay',
  kategori: 'kullanıcı'
};