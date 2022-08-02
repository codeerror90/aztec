import { mediafiredl } from '@bochilteam/scraper'
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) throw `✳️ Ingrese el link de mediafire junto al comando`
    if (!args[0].match(/mediafire/gi)) throw `❎ Link incorrecto`
    let res = await mediafiredl(args[0])
    let { url, url2, filename, ext, aploud, filesize, filesizeH } = res
    let caption = `
   ≡ *MEDIAFIRE*

▢ *Nombre:* ${filename}
▢ *Tamaño:* ${filesizeH}
▢ *Extension:* ${ext}
▢ *Subido:* ${aploud}
`.trim()
    m.reply(global.wait)
    await conn.sendFile(m.chat, url, 'Minecraft PE 1.19.0.05 Oficial - (by hermes).apk', '', m, null, { mimetype: 'application/vnd.android.package-archive', asDocument: true })
}

handler.help = ['mediafire']
handler.tags = ['downloader']
handler.command = ['mediafire', 'mfire'] 

export default handler
