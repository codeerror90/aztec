import fetch from 'node-fetch'

const regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i

let handler = async (m, { args, usedPrefix, command }) => {
    if (!args[0]) throw `*⛌ Ingrese el link de un repositorio de github que desea descargar*\n\n*• Ejemplo:*\n- ${usedPrefix + command} https://github.com/`
    if (!regex.test(args[0])) throw 'El link es incorrecto'
    let [_, user, repo] = args[0].match(regex) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, { method: 'HEAD' })).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    m.reply(`*↓ ‧ Descargando repositorio, espere . . .*`)
    conn.sendFile(m.chat, url, filename, null, m)
}

handler.help = ['gitclone']
handler.tags = ['downloader']
handler.command = /^(gitclone)$/i

export default handler
