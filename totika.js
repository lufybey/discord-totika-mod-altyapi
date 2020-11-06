//consts (for glitch)
// GEREKLİ YERLER
const express = require('express');
const app = express();
//const totika = require("./totika.json");
// GEREKLİ YERLER
// -------------------------------------------------------------
const Discord = require('discord.js');
const client = new Discord.Client();
const ayarlar = require('./ayarlar.json');
const chalk = require('chalk');
const fs = require('fs');
const moment = require('moment');
const Jimp = require('jimp');
const message = require('./events/message');
const db = require('quick.db');
require('./util/eventLoader')(client);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir('./komutlar/', (err, files) => {
  if (err) console.error(err);
  log(`Komutlar Yüklendi Komut Sayısı: ${files.length} `);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`${props.help.name} Başlatılıyor..`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(aliases => {
      client.aliases.set(aliases, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

  client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e){
      reject(e);
    }
  });
};

client.on('ready', () => {
  client.user.setPresence({
      game: {
          name: `${ayarlar.footer}`,
          type: 'PLAYING',
          //url: 'https://www.twitch.tv/gifwork'
          // Değerler:
          // PLAYING: Oynuyor
          // WATCHING: İzliyor
          // LISTENING: Dinliyor
          // STREAMING : Yayında
      },
            status: 'dnd'	
      // Değerler:
      // online: Çevrimiçi
      // dnd: Rahatsız Etmeyin
      // idle: Boşta
  })
})



// SNİPE
client.on("messageDelete", async message => {
  if (message.channel.type === "dm" || !message.guild || message.author.bot) return;
  await db.set(`snipe.${message.guild.id}.${message.channel.id}`, { yazar: message.author.id, yazilmaTarihi: message.createdTimestamp, silinmeTarihi: Date.now(), dosya: message.attachments.first() ? true : false });
  if (message.content) db.set(`snipe.${message.guild.id}.${message.channel.id}.icerik`, message.content);
});

// OTOTAG
client.on("userUpdate", async(old, nev) => {
  let guild = client.guilds.get(ayarlar.sunucuid)
  let rol = ayarlar.ekiprol
  let tag = ayarlar.tag
  let log = ayarlar.ekiplog

  if(old.username !== nev.username) {
  if(!nev.username.includes(tag) && guild.members.get(nev.id).roles.has(rol)) { //alınırsa
     let x = guild.members.get(nev.id).roles.filter(r => r.name !== "@everyone").map(r => r)
     guild.members.get(nev.id).removeRoles(x)
     guild.members.get(nev.id).setNickname('• İsim | Yaş').then(x => guild.members.get(nev.id).addRole(ayarlar.kayıtsız))
     client.channels.get(log).send(new Discord.RichEmbed().setTitle('• Birisi Aramızdan Ayrıldı.').setColor(client.randomrenk()).setDescription(`${nev} adlı kullanıcı tagı çıkardığı için tüm rollerini alıp, kayıtsız rolü verdim.`))
    } 
     if(nev.username.includes(tag) && !guild.members.get(nev.id).roles.has(rol)) {
      guild.members.get(nev.id).addRole(rol)
      client.channels.get(log).send(new Discord.RichEmbed().setTitle('• Birisi Aramıza Katıldı!').setColor(client.randomrenk()).setDescription(`${nev} adlı kullanıcı tagı eklediği için <@&${ayarlar.ekiprol}> rolü verdim.`))
     }
  }
  })

  //SES LOG
client.on('voiceStateUpdate', async (oldState, newState) => {
	 
  let log = newState.guild.channels.get(ayarlar.voicelog)
  let user = newState.guild.members.get(newState.id)

  if(oldState.voiceChannelID && newState.voiceChannelID && oldState.voiceChannelID != newState.voiceChannelID) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(oldState.voiceChannelID).name}\`** adlı ses kanalından **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** ses kanalına geçti`);
  if(!oldState.voiceChannelID && newState.voiceChannelID) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** adlı ses kanalına giriş yaptı!`);
  if(oldState.voiceChannelID && !newState.voiceChannelID) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(oldState.voiceChannelID).name}\`** adlı ses kanalından çıkış yaptı!`);
  if(oldState.voiceChannelID && !oldState.selfDeaf && newState.selfDeaf) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** adlı ses kanalında kendini sağırlaştırdı!`);
  if(oldState.voiceChannelID && oldState.selfDeaf && !newState.selfDeaf) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** adlı ses kanalında kendi sağırlaştırmasını kaldırdı!`);
  if(oldState.voiceChannelID && !oldState.selfMute && newState.selfMute) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** adlı ses kanalında kendini susturdu!`);
  if(oldState.voiceChannelID && oldState.selfMute && !newState.selfMute) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** adlı ses kanalında kendi susturmasını kaldırdı!`);
  if(oldState.voiceChannelID && !oldState.selfStream && newState.selfStream) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** adlı ses kanalında yayın açtı!`);
  if(oldState.voiceChannelID && oldState.selfStream && !newState.selfStream) return log.send(`**${user.displayName}** adlı üye, **\`${newState.guild.channels.get(newState.voiceChannelID).name}\`** adlı ses kanalında yayını kapattı!`);
 });

 
 client.on("guildMemberAdd", async(member) => {
  let djstürkiye = await db.get(`forceban_${member.guild.id}`)
  if(djstürkiye && djstürkiye.some(id => `k${member.user.id}` === id)) {
    try {
      await member.guild.owner.user.send(new Discord.RichEmbed().setTimestamp().setFooter(client.user.username + " Force Ban", client.user.avatarURL).setDescription(`Bir kullanıcı **${member.guild.name}** adlı sunucuna girmeye çalıştı! Force banı olduğu için tekrar yasaklandı. \n**Kullanıcı:** ${member.user.id} | ${member.user.tag}`))
      await member.user.send(new Discord.RichEmbed().setTimestamp().setFooter(client.user.username + " Force Ban", client.user.avatarURL).setDescription(`**${member.guild.name}** sunucusundan force banlı olduğun için yasaklandın!`))
      member.ban({reason: 'Forceban'})
    } catch(err) { console.log(err) }
  }
})


//////////////////
client.elevation = message => {
  if(!message.guild) {
	return; }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};
//RANDOM RENK
client.randomrenk = function () {
  let renkler = ["#00ffff","#1c0f45  ","#1c6071"]
  return renkler[Math.floor(Math.random() * renkler.length)]
 };


// BAN GİFLERİ
 client.bangif = function () {
  let bangifs = ["https://i.pinimg.com/originals/b2/84/33/b28433c392959f923ff0d736cd89dcbd.gif","https://media.discordapp.net/attachments/739168691089965118/740606115519397899/tenor.gif"]
  return bangifs[Math.floor(Math.random() * bangifs.length)]
 };


// HOŞGELDİN MESAJ
client.on("guildMemberAdd", async member => {
  const modulKaan = require('moment');
modulKaan.locale('tr')

let kurulus = new Date().getTime() - member.user.createdAt.getTime(); 
let beklenen = 604800000
let contentMessage
if(kurulus < beklenen) { 
  contentMessage = `
 ** • ${member} üyesi Sunucu'ya Katıldı Hesabını (\`${moment(member.user.createdAt).fromNow()}\`) Oluşturduğu için Şüpheli Rolü verildi! **
`
member.addRole(ayarlar.tehlikelihesap)
member.removeRole(ayarlar.kayıtsız)
member.setNickname("• Şüpheli Hesap")   
} else {
  contentMessage = `
<a:aquaticmorbook:737721800456273990> Sunucumuza hoş geldin ${member}, seninle Beraber \`${member.guild.memberCount}\` Kişiyiz.

<a:aquaticdonentac:766297706476863498> Sol tarafta bulunan kayıt odalarına girerek sunucumuza kayıt olabilirsin.

<a:aquaticdonuyor:737725448041267211> Hesabın \`${moment(member.user.createdA).format('Do MMMM YYYY')}\` tarihinde oluşturulduğu için kayıt olabilmende herhangi bir **engel bulunmamaktadır**.

<a:aquaticcevher:737721842646646926> Seninle <@&772823319812243477> ilgilenecektir.

<a:aquaticdonenkalp:737721974029025340> Sunucumuza kayıt olduğunda \`Rol-Seçim\` kategorisinde bulunan Rolleri Alabilirsiniz.
`
}
member.setNickname("• İsim | Yaş")   
member.addRole(ayarlar.kayıtsız)
let logChannel = member.guild.channels.get(ayarlar.hosgeldinkanal)

logChannel.send(contentMessage)
//logChannel.send(contentMessage, {file: `https://cdn.discordapp.com/attachments/768106074259324969/768197489316462633/ezgif-5-b9e5f9ec58db.gif`})

})

// MUTE SİSTEM
client.on("guildMemberAdd", async member => {
	let muteData = db.get(`${member.guild.id}.${member.id}.mute`)
	let log_channel = member.guild.channels.find('name', 'mute-log');

	if(muteData) {
		member.addRole(ayarlar.muterol) //Muted ID
		log_channel.send(new Discord.RichEmbed().setColor(client.randomrenk()).setTitle('Susturulma Bildirimi').setDescription(`**${member.user.tag}** isimli kullanıcı, susturma cezasını kaldırmak amaçlı sunucuda çık gir yaptı!\n \n\`\`\`Susturulma Sebebi: ${muteData}\`\`\``).setFooter(member.guild.name, member.guild.iconURL).setTimestamp())
	}
})

// CEZALI 
client.on('guildMemberAdd' , async member => {
  let j = await db.fetch(`jail_${member.guild.id}_${member.id}`)
  if(j === 'var') {
      member.addRole(ayarlar.ceza)
      member.removeRole(ayarlar.kayıtsız)	
      
  let kanal = client.channels.get(ayarlar.jlog) 
    let emb = new Discord.RichEmbed()
  .setColor('RANDOM')
  .setTitle('• Cezalı')
  .setDescription(`**${member} Adlı Kullanıcı \`Cezalı\`lıda Kayıtlı Olduğu İçin Sizi Tekrardan Cezalıya Attım! `)
client.channels.get(kanal).send(emb)

member.send(`${member} sunucumuza hoşgeldiniz sen onceden jailde oldugun için seni yeniden jaile atmak zorunda kaldım.`)
}
})

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;

client.on('warn', e => {
  console.log(chalk.bgYellow(e.replace(regToken, 'that was redacted')));
});

client.on('error', e => {
  console.log(chalk.bgRed(e.replace(regToken, 'that was redacted')));
});



// !TAG
client.on('message', async message => {
  if(message.author.bot || message.channel.type === "dm") return;
           if(message.content.includes('!tag')){
             [message.channel.send(ayarlar.tag)] 
      }
})
  // !lİNK
client.on('message', async message => {
  if(message.author.bot || message.channel.type === "dm") return;
           if(message.content.includes('!link')){
             [message.channel.send(ayarlar.link)] 
      }
})

client.on('guildMemberAdd' , async member => {
  let kanals = client.channels.get(ayarlar.joınleave) 
  let emb = new Discord.RichEmbed()
  .setColor(client.randomrenk())
  .setDescription(`**${member} üyesi sunucumuza Katıldı, onunla beraber \`${member.guild.memberCount}\` Kişiyiz **`)
kanals.send(emb)

})

client.on('guildMemberRemove' , async member => {
  let kanals = client.channels.get(ayarlar.joınleave) 
  let emb = new Discord.RichEmbed()
  .setColor(client.randomrenk())
  .setDescription(`**${member} üyesi sunucumuza Ayrıldı, Bir Kişi Eksiğiz \`${member.guild.memberCount}\` Kişiyiz **`)
kanals.send(emb)

})


client.login(ayarlar.token).then(c => console.log(`${client.user.tag} olarak giriş yapıldı!`)).catch(err => console.error("Bota giriş yapılırken başarısız olundu!"));






  

