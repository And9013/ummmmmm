const Discord = require('discord.js');
const client = new Discord.Client();
const token = "process.env.token";
const welcomeChannelName = "🎊ㅣ환영";
const byeChannelName = "🎇ㅣ안녕히가세요";
const welcomeChannelComment = "안녕하세요 ^^";
const byeChannelComment = "또오세요.. ㅠㅠ";

client.on('ready', () => {
  console.log('노래를 시작하지');
  client.user.setPresence({ game: { name: '"~play"' }, status: 'online' })
});

client.on("guildMemberAdd", (member) => {
  const guild = member.guild;
  const newUser = member.user;
  const welcomeChannel = guild.channels.find(channel => channel.name == welcomeChannelName);

  welcomeChannel.send(`<@${newUser.id}> ${welcomeChannelComment}\n`);

  member.addRole(guild.roles.find(role => role.name == "게스트"));
});

client.on("guildMemberRemove", (member) => {
  const guild = member.guild;
  const deleteUser = member.user;
  const byeChannel = guild.channels.find(channel => channel.name == byeChannelName);

  byeChannel.send(`<@${deleteUser.id}> ${byeChannelComment}\n`);
});

client.on('message', (message) => {
  if(message.author.bot) return;

  if(message.content == '~쭈녑') {
    return message.reply('잘생김 ㅇㅈ?');
  }

  if(message.content == '~안녕') {
    return message.reply('안녕하세요 저는 쭈녑 봇이에요');
  }

  if(message.content == '쭈녑 유튜브') {
    let img = 'https://cdn.discordapp.com/attachments/738243487220236329/785098516904280064/unnamed.png';
    let embed = new Discord.RichEmbed()
      .setTitle('쭈녑 유튜브')
      .setURL('https://www.youtube.com/channel/UC9IPqMlUzHGkiHdEzz0SJgA')
      .setAuthor('', img, 'https://www.youtube.com/channel/UC9IPqMlUzHGkiHdEzz0SJgA')
      .setThumbnail(img)
      .addBlankField()
      .addField('안녕하세요 쭈녑입니다', '구독 좋아요 알림설정 부탁해요')
      .addField('펜카페', 'http://naver.me/xUJQxlZw', true)
      .addField('로블록스 그룹', ' https://web.roblox.com/groups/7726093/unnamed#!/about', true)
      .addBlankField()
      .setTimestamp()
      .setFooter('', img)
      .setColor('280a50');
      
    message.channel.send(embed)
  } else if(message.content == 'help') {
    let helpImg = 'https://images-ext-1.discordapp.net/external/RyofVqSAVAi0H9-1yK6M8NGy2grU5TWZkLadG-rwqk0/https/i.imgur.com/EZRAPxR.png';
    let commandList = [
      {name: 'ping', desc: '현재 핑 상태'},
      {name: '쭈녑 유튜브', desc: 'embed 예제1'},
      {name: 'embed2', desc: 'embed 예제2 (help)'},
      {name: '!전체공지', desc: 'dm으로 전체 공지 보내기'},
      {name: '~청소', desc: '텍스트 지움'},
    ];

    
    commandList.forEach(x => {
      commandStr += `• \`\`${changeCommandStringLength(`${x.name}`)}\`\` : **${x.desc}**\n`;
    });

    embed.addField('Commands: ', commandStr);

    message.channel.send(embed)
  }

  if(message.content.startsWith('!전체공지')) {
    if(checkPermission(message)) return
    if(message.member != null) { // 채널에서 공지 쓸 때
      let contents = message.content.slice('!전체공지'.length);
      message.member.guild.members.array().forEach(x => {
        if(x.user.bot) return;
        x.user.send(`<@${message.author.id}> ${contents}`);
      });
  
      return message.reply('공지를 전송했습니다.');
    } else {
      return message.reply('채널에서 실행해주세요.');
    }
  }

  if(message.content.startsWith('~청소')) {
    if(checkPermission(message)) return

    var clearLine = message.content.slice('~청소 '.length);
    var isNum = !isNaN(clearLine)

    if(isNum && (clearLine <= 0 || 100 < clearLine)) {
      message.channel.send("1부터 100까지의 숫자만 입력해주세요.")
      return;
    } else if(!isNum) { // c @나긋해 3
      if(message.content.split('<@').length == 2) {
        if(isNaN(message.content.split(' ')[2])) return;

        var user = message.content.split(' ')[1].split('<@!')[1].split('>')[0];
        var count = parseInt(message.content.split(' ')[2])+1;
        const _limit = 10;
        let _cnt = 0;

        message.channel.fetchMessages({limit: _limit}).then(collected => {
          collected.every(msg => {
            if(msg.author.id == user) {
              msg.delete();
              ++_cnt;
            }
            return !(_cnt == count);
          });
        });
      }
    } else {
      message.channel.bulkDelete(parseInt(clearLine)+1)
        .then(() => {
          AutoMsgDelete(message, `<@${message.author.id}> ` + parseInt(clearLine) + "개의 메시지를 삭제했습니다. (이 메세지는 잠시 후에 사라집니다.)");
        })
        .catch(console.error)
    }
  }
});

function checkPermission(message) {
  if(!message.member.hasPermission("MANAGE_MESSAGES")) {
    message.channel.send(`<@${message.author.id}> ` + "명령어를 수행할 관리자 권한을 소지하고 있지않습니다.")
    return true;
  } else {
    return false;
  }
}

function changeCommandStringLength(str, limitLen = 8) {
  let tmp = str;
  limitLen -= tmp.length;

  for(let i=0;i<limitLen;i++) {
      tmp += ' ';
  }

  return tmp;
}

async function AutoMsgDelete(message, str, delay = 3000) {
  let msg = await message.channel.send(str);

  setTimeout(() => {
    msg.delete();
  }, delay);
}


client.login(token);