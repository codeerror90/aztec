let handler = async (m, { conn, args, usedPrefix, command }) => {

  let enn = `-`
  await conn.reply(m.chat, enn, m)

  let type = (command).toLowerCase()
  let type2 = (args[0] || ' ').toLowerCase()

  switch (type) {
  case 'autosticker':
    await conn.sendButton(m.chat, '', wm, [['Desactivar', `${usedPrefix + command} off`], ['Activar', `${usedPrefix + command} on`]], m)
    switch (type2) {
    case 'off':
      global.db.data.chats[m.chat].autosticker = false 
      await m.reply('Se desactivó la función de autosticker en este grupo')
    break
    case 'on':
      global.db.data.chats[m.chat].autosticker = true 
      await m.reply('Se activó la función de autosticker en este grupo')
    break
    }
  break
  }
}

handler.help = ['autosticker']
handler.tags = ['random']
handler.command = /^(autosticker)$/i

export default handler


function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

