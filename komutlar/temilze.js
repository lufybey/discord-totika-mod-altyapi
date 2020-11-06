const Discord = require('discord.js');

exports.run = async(yashinu, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(``);
  if (!args[0] || isNaN(args[0])) return message.reply(``);
  await message.delete();
  let sayi = Number(args[0]);
  let silinen = 0;
  for (var i = 0; i < (Math.floor(sayi/100)); i++) {
    await message.channel.bulkDelete(100).then(r => silinen+=r.size);
    sayi = sayi-100;
  };
  if (sayi > 0) await message.channel.bulkDelete(sayi).then(r => silinen+=r.size);
let embed = new Discord.RichEmbed()
.setAuthor(message.author.tag ,message.author.avatarURL)
.setColor("RANDOM")
.setDescription(`**${silinen}** Mesaj Başarı İle Silindi!`)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["sil"],
  permLevel: 0
};

exports.help = { 
  name: 'temizle', 
  description: 'Belirtilen miktarda mesajı temizler. (Sınırsız)',
  usage: 'temizle <miktar>',
  kategori: 'kullanıcı'
};

