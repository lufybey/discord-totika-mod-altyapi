const Discord = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send()


let yas18 = message.guild.members.filter(x=> x.displayName.includes("18")).size;
let yas19 = message.guild.members.filter(x=> x.displayName.includes("19")).size;
let yas20 = message.guild.members.filter(x=> x.displayName.includes("20")).size;
let yas16 = message.guild.members.filter(x=> x.displayName.includes("16")).size;
let yas17 = message.guild.members.filter(x=> x.displayName.includes("17")).size;


let embed = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setAuthor(message.guild.name, message.guild.iconURL)
.setDescription(`Sunucudaki Yaş Ortalaması; 
\`16 Yaş:\` **${yas16}** Kişi
\`17 Yaş:\` **${yas17}** Kişi
\`18 Yaş:\` **${yas18}** Kişi
\`19 Yaş:\` **${yas19}** Kişi
\`20 Yaş:\` **${yas20}** Kişi`)
.setImage(client.bangif())
.setThumbnail(message.guild.iconURL)
message.channel.send(embed)

}
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["yaş-ortalaması"],
    permLevel: 0
}

exports.help = {
    name: 'y',
}