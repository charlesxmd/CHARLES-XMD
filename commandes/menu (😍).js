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

    // Meta Verified vCard
    const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${s.BOT} (Meta Verified)
ORG:Meta;
TEL;type=CELL;type=VOICE;waid=${s.254759626063}:+${s.254759626063}
URL:https://meta.com/verified
EMAIL:contact@${s.BOT.toLowerCase().replace(/\s/g, '')}.com
NOTE:Officially verified by Meta
X-ABLabel:Verified Badge
END:VCARD
`;

    let infoMsg = `
╭━━━━━━━━━━━━━━━━━━━━━━╮
│   🌟 *${s.BOT}* 🌟   │
├──────────────────────┤
│  👑 Owner » ${s.OWNER_NAME}
│  ⚡ Prefix » [ ${s.PREFIXE} ]
│  🔒 Mode » *${mode}*
│  📅 Date » *${date}*
│  🎵 Music » ${s.PREFIXE}play <song>
│  📢 Channel » ${s.PREFIXE}newsletter
│  ✅ Status » *Meta Verified* 🔵
├──────────────────────┤
│  💻 Platform » ${os.platform()}
│  📊 Commands » ${cm.length}
╰━━━━━━━━━━━━━━━━━━━━━━╯
${readmore}
`;

    let menuMsg = `📜 *COMMAND MENU* 📜\n\n`;
    
    for (const cat in coms) {
        menuMsg += `╭───「 *${cat.toUpperCase()}* 」───⊷\n`;
        menuMsg += `│\n`;
        for (const cmd of coms[cat]) {
            menuMsg += `│ ➠ *${s.PREFIXE}${cmd}*\n`;    
        }
        menuMsg += `│\n`;
        menuMsg += `╰────────────────⊷\n\n`;
    }
    
    menuMsg += `📢 *Newsletter Channel:*\nhttps://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K\n\n`;
    menuMsg += `🎵 *Music Example:*\n${s.PREFIXE}play blinding lights\n\n`;
    menuMsg += `🔵 *Meta Verified* - Official WhatsApp Partner`;

    try {
        await zk.sendMessage(dest, {
            contacts: {
                displayName: `${s.BOT} (Verified)`,
                contacts: [{ vcard }]
            },
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [nomAuteurMessage],
                externalAdReply: {
                    title: `${s.BOT} | Meta Verified`,
                    body: "Tap for music & channel updates",
                    thumbnailUrl: "https://i.imgur.com/3pQeW5X.png", // Blue verified badge image
                    sourceUrl: "https://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (error) {
        console.error("Menu error: ", error);
        repondre("❌ Error loading menu: " + error);
    }
});
