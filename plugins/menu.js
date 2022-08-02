import { promises } from 'fs'
import { join } from 'path'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'

let tags = {
  'main': 'Menu 🧇',
  'rpg': 'Juego - RPG 🌋',
  'game': 'Juegos 🎮',
  'exp': 'Exp & limite ✨',
  'sticker': 'Stickers 🧩',
  'maker': 'Logo - maker 🎨',
  'random': 'Random 🍥',
  'adm': 'Admins 😎',
  'nable': 'Activadores 🛎️',
  'group': 'Grupos 👥',
  'premium': 'Premiun 👑',
  'internet': 'Internet 📶',
  'downloader': 'Descargas 📥',
  'search': 'Buscador 🔎',
  'tools': 'Ajustes ⚙️',
  'fun': 'Diverción 🎡',
  'database': 'Almacenamiento 📂',
  'nsfw': 'Nsfw 🔞',
  'owner': 'Creador 🐈',
  'info': 'Info 📍',
  'advanced': 'Abanzado 💠',
}

const defaultMenu = {
  before: `
*꒷꒦꒷꒷꒦꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷꒷꒦꒷꒷꒦꒷꒷꒦꒷꒦꒷꒦꒷꒦꒷*

“ Holɑ *%taguser 👋🏻*, %greeting ”


\t\t\t*I N F O  -  U S E R*
🍬 *Nombre* : %name
🍬 *Exp* : %totalexp
🍬 *Limite* : %limit
🍬 *Rango* : %role
🍬 *Nivel* : %level

⠀\t\t\t*I N F O  -  B O T*
🍬 *Usuarios* : %totalreg
🍬 *Regs* : %rtotalreg
🍬 *Hora* : %time

⠀\t\t\t*I N F O  -  N P M*
🍬 *Nombre* : %npmname
🍬 *Descrip* : %npmdesc
🍬 *Versión* : %version
🍬 *Main* : %npmmain
🍬 *Autor* : %author
🍬 *Licencia* : %license


“ Si encuentrɑ un error en lɑ bot reportɑr con el comɑndo *%preport* ”

*Ժ╴ ╴ ╴ ╴ ╴ ╴ ╴ ╴ ╴ ╴ ╴ ╴ ╴ ╴*

\t\t\t*L I S T A  -  M E N U S*
`.trimStart(),
  header: '*≡ %category*\nᅠ┌─',
  body: 'ᅠ│∙ *%cmd*\n',
  footer: 'ᅠ╰•\n╴',
  after: '',
}

let handler = async (m, { conn, usedPrefix: _p, __dirname }) => {
  try {
    let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
    let { exp, limit, level, role } = global.db.data.users[m.sender]
    let { min, xp, max } = xpRange(level, global.multiplier)
    let name = await conn.getName(m.sender)
    let d = new Date(new Date + 3600000)
    let locale = 'es'
    // d.getTimeZoneOffset()
    // Offset -420 is 18.00
    // Offset    0 is  0.00
    // Offset  420 is  7.00
    let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
    let week = d.toLocaleDateString(locale, { weekday: 'long' })
    let date = d.toLocaleDateString(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(d)
    let time = d.toLocaleTimeString(locale, {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    })
    let _uptime = process.uptime() * 1000
    let _muptime
    if (process.send) {
      process.send('uptime')
      _muptime = await new Promise(resolve => {
        process.once('message', resolve)
        setTimeout(resolve, 1000)
      }) * 1000
    }
    let muptime = clockString(_muptime)
    let uptime = clockString(_uptime)
    let totalreg = Object.keys(global.db.data.users).length
    let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
    let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
      return {
        help: Array.isArray(plugin.tags) ? plugin.help : [plugin.help],
        tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
        prefix: 'customPrefix' in plugin,
        limit: plugin.limit,
        premium: plugin.premium,
        enabled: !plugin.disabled,
      }
    })
    for (let plugin of help)
      if (plugin && 'tags' in plugin)
        for (let tag of plugin.tags)
          if (!(tag in tags) && tag) tags[tag] = tag
    conn.menu = conn.menu ? conn.menu : {}
    let before = conn.menu.before || defaultMenu.before
    let header = conn.menu.header || defaultMenu.header
    let body = conn.menu.body || defaultMenu.body
    let footer = conn.menu.footer || defaultMenu.footer
    let after = conn.menu.after || (conn.user.jid == global.conn.user.jid ? '' : `Powered by https://wa.me/${global.conn.user.jid.split`@`[0]}`) + defaultMenu.after
    let _text = [
      before,
      ...Object.keys(tags).map(tag => {
        return header.replace(/%category/g, tags[tag]) + '\n' + [
          ...help.filter(menu => menu.tags && menu.tags.includes(tag) && menu.help).map(menu => {
            return menu.help.map(help => {
              return body.replace(/%cmd/g, menu.prefix ? help : '%p' + help)
                .replace(/%islimit/g, menu.limit ? '˄' : '')
                .replace(/%isPremium/g, menu.premium ? '˄' : '')
                .trim()
            }).join('\n')
          }),
          footer
        ].join('\n')
      }),
      after
    ].join('\n')
    let text = typeof conn.menu == 'string' ? conn.menu : typeof conn.menu == 'object' ? _text : ''
    let replace = {
      '%': '%',
      p: _p, uptime, muptime,
      taguser: '@' + m.sender.split("@s.whatsapp.net")[0],
      wasp: '@0',
      me: conn.getName(conn.user.jid),
      npmname: _package.name,
      version: _package.version,
      npmdesc: _package.description,
      npmmain: _package.main,
      author: _package.author.name,
      license: _package.license,
      exp: exp - min,
      maxexp: xp,
      totalexp: exp,
      xp4levelup: max - exp,
      github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
      greeting, level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
      readmore: readMore
    }
    text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
    
    let buttons = [
                    { buttonId: '!info', buttonText: { displayText: 'Info 🎌' }, type: 1 },
                    { buttonId: '!owner', buttonText: { displayText: 'Creador 🐬' }, type: 1 }
                ]
                let buttonMessage = {
                    image: imgmenu,
                    caption: text.trim(),
                    mentions: [m.sender],
                    footer: conn.user.name,
                    buttons: buttons,
                    headerType: 4,
                    contextInfo: {
                    mentionedJid: [m.sender],
                    externalAdReply: {
                    showAdAttribution: true,
                    mediaType: 'VIDEO',
                    mediaUrl: '',
                    title: '作成されたボット — 尼僧',
                    body: 'By Hermes',
                    thumbnail: miniurl,
                    sourceUrl: 'https://chat.whatsapp.com/ELnd6Ck7InP6UmA3QiQsgo'
                    }}
                }
                conn.sendMessage(m.chat, buttonMessage, { quoted: m })


  //const pp = await conn.profilePictureUrl(conn.user.jid).catch(_ => './src/avatar_contact.png')
  //const pp = await (await fetch('https://i.ibb.co/qMG1JPY/fg.jpg')).buffer()
  //await conn.sendButton(m.chat, text.trim(), 'Creɑted by gɑtito ⾕', imgmenu, [['Info 🧃', '.ping'], ['Creador 🍭', '.owner']], false, { quoted: m, contextInfo: { mentionedJid: [m.sender], externalAdReply: { showAdAttribution: true, mediaType: 'VIDEO', mediaUrl: '', title: '作成されたボット — 尼僧', body: 'By gɑtito ⾕', thumbnail: miniurl, sourceUrl: 'https://chat.whatsapp.com/ELn6Ck7InoP6UmA3QiQsgo' }}})
  //const buttons = [ { buttonId: `.info`, buttonText: { displayText: 'Info 🧃' }, type: 1 }, { buttonId: `.creador`, buttonText: { displayText: 'Creador 🍭' }, type: 1 }, ]
  //let buttonMessage = { "document": { url: "https://wa.me/51940617554" }, "fileName": '𝕷𝖔𝖑𝖎𝖇𝖔𝖙 - 𝕺𝖋𝖎𝖈𝖎𝖆𝖑™.⁖⃟•᭄', "mimetype": 'application/vnd.ms-excel', "jpegThumbnail": false, "caption": text.trim(), "fileLength": '99999999999999', "mentions": [m.sender, '0@s.whatsapp.net'], "footer": 'By gɑtito ⾕', "buttons": buttons, "headerType": 4, contextInfo: { "mentionedJid": [m.sender, '0@s.whatsapp.net'], "externalAdReply": { "showAdAttribution": true, "title": '作成されたボット — 尼僧', "mediaType": 2, "previewType": "VIDEO", "thumbnail": imgmenu, "mediaUrl": 'https://youtu.be/jeXHB0IIzCM', "sourceUrl": 'https://chat.whatsapp.com/ELn6Ck7InoP6UmA3QiQsgo' }}} 
  //conn.sendMessage(m.chat, buttonMessage, { quoted: m })

  } catch (e) {
    conn.reply(m.chat, '❎ Lo sentimos, el menú tiene un error.', m)
    throw e
  }
}

handler.help = ['menu']
handler.tags = ['main']
handler.command = ['menu', 'help', 'menú'] 

export default handler


const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)

function clockString(ms) {
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')
}

  var ase = new Date();
  var hour = ase.getHours();
switch(hour){
  case 0: hour = 'una linda noche 🌙'; break;
  case 1: hour = 'una linda noche 💤'; break;
  case 2: hour = 'una linda noche 🦉'; break;
  case 3: hour = 'una linda mañana ✨'; break;
  case 4: hour = 'una linda mañana 💫'; break;
  case 5: hour = 'una linda mañana 🌅'; break;
  case 6: hour = 'una linda mañana 🌄'; break;
  case 7: hour = 'una linda mañana 🌅'; break;
  case 8: hour = 'una linda mañana 💫'; break;
  case 9: hour = 'una linda mañana ✨'; break;
  case 10: hour = 'un lindo dia 🌞'; break;
  case 11: hour = 'un lindo dia 🌨'; break;
  case 12: hour = 'un lindo dia ❄'; break;
  case 13: hour = 'un lindo dia 🌤'; break;
  case 14: hour = 'una linda tarde 🌇'; break;
  case 15: hour = 'una linda tarde 🥀'; break;
  case 16: hour = 'una linda tarde 🌹'; break;
  case 17: hour = 'una linda tarde 🌆'; break;
  case 18: hour = 'una linda noche 🌙'; break;
  case 19: hour = 'una linda noche 🌃'; break;
  case 20: hour = 'una linda noche 🌌'; break;
  case 21: hour = 'una linda noche 🌃'; break;
  case 22: hour = 'una linda noche 🌙'; break;
  case 23: hour = 'una linda noche 🌃'; break;
}
  var greeting = "espero que tengas " + hour;
