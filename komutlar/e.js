const { RichEmbed } = require('discord.js')
const db = require('quick.db')
const ayarlar = require("../ayarlar.json");
exports.run = async(client, message, args) => {
  console.log(args)

        let tag = ayarlar.tag
        let isim = args[1]
        let yas = args[2]

        let member = message.guild.member(message.mentions.members.first() || message.guild.members.get(args[0]))

  if(!message.member.roles.get(ayarlar.kytsorumlu) && !message.member.hasPermission('ADMINISTRATOR')) return message.channel.send()

        if (!member) return message.channel.send(new RichEmbed().setColor(client.randomrenk()).setAuthor(message.author.tag, message.author.avatarURL).setDescription("Lütfen bir üyeyi etiketle ve isim yaş belirt. \n \`@Totika/İD\`"))
        if (!isim) returnmessage.channel.send(new RichEmbed().setColor(client.randomrenk()).setAuthor(message.author.tag, message.author.avatarURL).setDescription("Lütfen bir üyeyi etiketle \n \`@Totika/İD\`"))
        if (!yas) return message.channel.send(new RichEmbed().setColor(client.randomrenk()).setAuthor(message.author.tag, message.author.avatarURL).setDescription("Geçerli Bir Yaş Girmelisin. \n \`@Totika/İD İsim Yaş\`"))

        isim = `${tag} ${isim.substr(0,1).toUpperCase()+isim.substr(1,isim.length)} | ${yas}`
        
        console.log(isim)
        

        member.setNickname(isim).catch(() => { console.log("İsmi değiştirirken sorun oluştu.") })

        let veri = await db.get(`${message.guild.id}.${member.id}.kayıt`)
        let puan = await db.fetch(`cezapuan.${member.id}`)
        if(puan >= 100) {
            return message.channel.send(
                new RichEmbed()
                .setColor(client.randomrenk())
                .setAuthor(message.author.tag , message.author.avatarURL)
                .setDescription(`${member} üyesi **100** ceza puanını aştığı için onu kayıt edemiyoruz, lütfen yetkiliye ulaşın!`))
           }
        console.log(veri)

        let erkekRol1 = message.guild.roles.get(ayarlar.erkekrol1)
        let erkekRol2 = message.guild.roles.get(ayarlar.erkekrol2)
        let kayıtsız = message.guild.roles.get(ayarlar.kayıtsız)
        if (!veri) {
            db.set(`${message.guild.id}.${member.id}.kayıt`, { cinsiyet: [erkekRol1.toString()], isimyas: [`${isim}`] })
        } else {
            veri.cinsiyet.push(erkekRol1.toString())
            veri.isimyas.push(isim)
            db.set(`${message.guild.id}.${member.id}.kayıt`, veri)
        }


        const embed = new RichEmbed()
            .setColor(client.randomrenk())
            .setAuthor(message.author.tag, message.author.avatarURL)

        if (!veri) {
            embed.setDescription(`${member} üyesine ${erkekRol1} rolü başarıyla verildi.`) //maplama kısmı
        } else {
            embed.setDescription(`${member} üyesine ${erkekRol1} rolü başarıyla verildi.
    
:x: Kayıt edilen kullanıcının sunucuda toplam ${veri.isimyas.length} isimi kayıtlı olarak bulundu.
${veri.isimyas.map((r, index) => `\`\`${r}\`\`(${veri.cinsiyet[index++]})`).join('\n')}`)
    }

member.removeRole(kayıtsız.id)
    member.addRole(erkekRol1.id)
    member.addRole(erkekRol2.id)
    message.channel.send(embed)
    db.add(`${guild.id}.${user.id}.manAmount`, 1)
    db.add(`${message.guild.id}.${message.author.id}.kayıtSorgu_`, 1)
    require("quick.db").add(`${member.guild.id}.${member.id}.manAmount`, 1)
} 

exports.conf = {
    enabled: true,
    aliases: ["e"],
    guildOnly: false,
    permLevel: 0
  };
  
  exports.help = {
    name: 'erkek',
    description: 'Bir üyeye erkek olarak kayıt eder.',
    usage: '<@üye> <isim> <yaş>',
    examples: '@blackparadoxz Sabri 19'
  };