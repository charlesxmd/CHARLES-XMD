const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);

zokou({ nomCom: "menu", categorie: "Menu" }, async (dest, zk, commandeOptions) => {
    let { ms, repondre, prefixe, nomAuteurMessage, mybotpic } = commandeOptions;
    let { cm } = require(__dirname + "/../framework/zokou");
    let coms = {};
    let mode = "public";

    if ((s.MODE).toLowerCase() !== "yes") {
        mode = "private";
    }

    cm.map((com) => {
        if (!coms[com.categorie]) {
            coms[com.categorie] = [];
        }
        coms[com.categorie].push(com.nomCom);
    });

    moment.tz.setDefault('Etc/GMT');
    const temps = moment().format('HH:mm:ss');
    const date = moment().format('DD/MM/YYYY');

    let infoMsg = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
│   🔥 *${s.BOT}* 🔥   │
├──────────────────────┤
│  👑 Owner » ${s.OWNER_NAME}
│  ⚡ Prefix » [ ${s.PREFIXE} ]
│  🔒 Mode » *${mode}*
│  📅 Date » *${date}*
│  🎵 Music » /play <song>
│  📢 Channel » /channel
│  ✅ Verified » ✅ (Official Bot)
│  📊 Commands » ${cm.length}
├──────────────────────┤
│  🚀 Powered By: *CHARLES XMD*
╰━━━━━━━━━━━━━━━━━━━━━━╯
${readmore}
`;

    let menuMsg = `📜 *COMMAND LIST* 📜\n\n`;
    
    for (const cat in coms) {
        menuMsg += `╭───「 *${cat.toUpperCase()}* 」───⊷\n`;
        menuMsg += `│\n`;
        for (const cmd of coms[cat]) {
            menuMsg += `│ ➠ *${s.PREFIXE}${cmd}*\n`;    
        }
        menuMsg += `│\n`;
        menuMsg += `╰────────────────⊷\n\n`;
    }
    
    menuMsg += `📢 *Follow our channel:*\nhttps://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K\n\n`;
    menuMsg += `🎵 *Music Bot:* Use *${s.PREFIXE}play* <song-name>\n\n`;
    menuMsg += `✅ *Verified Bot | © CHARLES XMD*`;

    try {
        await zk.sendMessage(dest, {
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                externalAdReply: {
                    title: "🎵 CHARLES XMD BOT 🎶",
                    body: "✅ Verified Bot | Tap for Music & Updates",
                    thumbnailUrl: "https://files.catbox.moe/wxektf.mp3",
                    sourceUrl: "https://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (error) {
        console.error("Menu Error: ", error);
        repondre("❌ Error loading menu: " + error);
    }
});
