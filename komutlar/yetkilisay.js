const Discord = require('discord.js');
const moment = require("moment")
const ayarlar = require("../ayarlar.json")

exports.run = async (client, message, args) => {

  let enAltYetkiliRolü = message.guild.roles.get("753043746475606147"); // en alttaki rol id
  let yetkililer = message.guild.members.filter(uye => uye.highestRole.position >= enAltYetkiliRolü.position);
  let embed = new Discord.RichEmbed()
  .setColor(client.randomrenk())
  .setDescription(`
  \`•\` Toplam Yetkili Sayısı: ${yetkililer.size}
  \`•\` Aktif Yetkili Sayısı: ${yetkililer.filter(uye => uye.presence.status !== "offline").size}
  \`•\` Sesli Kanalda Bulunanlar: ${yetkililer.filter(uye => uye.voiceChannel).size}
  \`•\` Sesli Kanalda Olmayan Yetkililer: ${yetkililer.filter(uye => !uye.voiceChannel).size}  
  
  `)

  message.channel.send(embed);
};

exports.conf = {
  enabled: true, 
  guildOnly: true,
  aliases: [], 
  permLevel: 0
};

exports.help = {
  name: 'yetkilisay', 
  description: 'Yetkilileri sayar.', 
  usage: 'yetkilisay',
  kategori: 'yetkili'
};
