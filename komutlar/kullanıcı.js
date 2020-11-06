const ayarlar = require("../ayarlar.json")
const Discord = require("discord.js")
const moment = require("moment")

exports.run = async(client, message, args) => {
    moment.locale("tr")
   let member = message.mentions.users.first() || message.author
   const Durum = message.author.presence.status;
const durm = (Durum == "online" ? (client.emojis.get('750113961478979645') + "Çevrimiçi") : (Durum == "offline" ? (client.emojis.get('750113961478979645') + "Çevrimdışı") : (Durum == "idle" ? (client.emojis.get('750113961478979645') + "Boşta") : (Durum == "dnd" ? (client.emojis.get('750113961478979645') + "Rahatsız Etmeyin") : ("Bilinmiyor/bulunamadı.")))))

   let x = message.guild.member(member.id)
   x.nickname ? x.nickname : "Takma Adı Bulunmuyor."

if(!member) return message.channel.send(new Discord.RichEmbed().setColor(client.randomrenk()).setAuthor(message.author.tag , message.author.avatarURL)).setDescription(`Geçerli Bir Üye Girmelisinsin.`)
let embed = new Discord.RichEmbed()
.setColor(client.randomrenk())
.setThumbnail(member.avatarURL)
.setAuthor(message.author.tag , message.author.avatarURL)
.setDescription(`
**__Kullanıcı Bilgisi__**

\`İD:\` ${member.id}
\`Profil:\` ${member}
\`Durum:\` ${durm}
\`Oluşturma Tarihi:\` ${moment(message.author.createdAt).format('Do MMMM YYYY')} | ${moment(message.author.createdAt).fromNow()}


**__Üye Bilgisi__**
\`Katılma Tarihi:\` ${moment(member.joinedAt).fromNow()}
\`Katılım Sırası:\` ${message.guild.members.sort((a,b) => b.joinedTimestamp - a.joinedTimestamp).array().findIndex(x => x.user.id === message.author.id)} / ${message.guild.members.size}
\`Takma Adı:\` ${x.nickname ? x.nickname : "Takma Adı Bulunmuyor."}
\`Rolleri:\` ${x.roles.filter(r => r.name !== "@everyone").map(r => r).join(' , ') ? x.roles.filter(r => r.name !== "@everyone").map(r => r).join(' , ') : 'Bu kullanıcının bu sunucuda hiç rolü bulunmuyor.'}

`)

message.channel.send(embed)
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ["i"],
  permLevel: 0
};

exports.help = { 
  name: 'kullanıcıbilgi', 
};
