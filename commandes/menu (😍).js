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
╭━═「 *${s.BOT}* 」═━❂
┃⊛╭────••••────➻
┃⊛│◆ 𝙾𝚠𝚗𝚎𝚛 : ${s.OWNER_NAME}
┃⊛│◆ 𝙿𝚛𝚎𝚏𝚒𝚡 : [ ${s.PREFIXE} ]
┃⊛│◆ 𝙼𝚘𝚍𝚎 : *${mode}*
┃⊛│◆ 𝚁𝚊𝚖  : 𝟴/𝟭𝟯𝟮 𝗚𝗕
┃⊛│◆ 𝙳𝚊𝚝𝚎  : *${date}*
┃⊛│◆ 𝙿𝚕𝚊𝚝𝚏𝚘𝚛𝚖 : ${os.platform()}
┃⊛│◆ 𝙲𝚛𝚎𝚊𝚝𝚘𝚛 : charles
┃⊛│◆ 𝙲𝚘𝚖𝚖𝚊𝚗𝚍𝚜 : ${cm.length}
┃⊛│◆ 𝚃𝚑𝚎𝚖𝚎 : CHARLES XMD
┃⊛└────••••────➻
╰─━━━━══──══━━━❂\n${readmore}
`;

    let menuMsg = `CHARLES XMD`;
    
    for (const cat in coms) {
        menuMsg += `
❁━━〔 *${cat}* 〕━━❁
╭━━══••══━━••⊷
║◆┊ `;
        for (const cmd of coms[cat]) {
            menuMsg += `          
║◆┊ ${s.PREFIXE}  *${cmd}*`;    
        }
        menuMsg += `
║◆┊
╰─━━═••═━━••⊷`;
    }
    
    menuMsg += `
> Made By charles\n`;

    try {
        const senderName = nomAuteurMessage || message.from;  // Use correct variable for sender name
        
        // Path to your music file (replace with actual path)
        const musicPath = "https://files.catbox.moe/wxektf.mp3"; // Example: "./path/to/music.mp3"
        
        // Check if the music file exists
        if (fs.existsSync(musicPath)) {
            const audioData = fs.readFileSync(musicPath);
            
            await zk.sendMessage(dest, {
                audio: audioData,
                mimetype: 'audio/mpeg',
                ptt: false,
                contextInfo: {
                    mentionedJid: [senderName],
                    externalAdReply: {
                        title: "CHARLES XMD MENU LIST",
                        body: "I have more tap to follow channel",
                        thumbnailUrl: "https://files.catbox.moe/bhczj9.jpg",
                        sourceUrl: "https://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K",
                        mediaType: 1,
                        renderLargerThumbnail: true
                    }
                }
            });
        } else {
            console.error("Music file not found:", musicPath);
        }

        // Send the menu text message
        await zk.sendMessage(dest, {
            text: infoMsg + menuMsg,
            contextInfo: {
                mentionedJid: [senderName],
                externalAdReply: {
                    title: "CHARLES XMD MENU LIST",
                    body: "I have more tap to follow channel",
                    thumbnailUrl: "https://files.catbox.moe/bhczj9.jpg",
                    sourceUrl: "https://whatsapp.com/channel/0029Vao2hgeChq6HJ5bmlZ3K",
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            }
        });

    } catch (error) {
        console.error("Menu error: ", error);
        repondre("🥵🥵 Menu error: " + error);
    }
});
