const util = require('util');
const fs = require('fs-extra');
const { zokou } = require(__dirname + "/../framework/zokou");
const { format } = require(__dirname + "/../framework/mesfonctions");
const os = require("os");
const moment = require("moment-timezone");
const s = require(__dirname + "/../set");
const more = String.fromCharCode(8206);
const readmore = more.repeat(4001);
const axios = require('axios'); // Required for URL audio support

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
┃⊛│◆ �𝚛𝚎𝚏𝚒𝚡 : [ ${s.PREFIXE} ]
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
        const senderName = nomAuteurMessage || message.from;
        
        // Music options - choose either local file or URL
        const musicOptions = {
            localPath: "./music/menu-theme.mp3", // Local file path
            url: "https://files.catbox.moe/iq9j1v.mp3", // Direct audio URL
            useURL: true // Set to false to use local file instead
        };

        // Function to send audio
        async function sendAudio() {
            if (musicOptions.useURL) {
                // Send audio from URL
                await zk.sendMessage(dest, {
                    audio: { url: musicOptions.url },
                    mimetype: 'audio/mpeg',
                    ptt: false,
                    contextInfo: {
                        mentionedJid: [senderName],
                        externalAdReply: {
                            title: "CHARLES XMD MUSIC",
                            body: "Enjoy the theme music!",
                            thumbnailUrl: "https://files.catbox.moe/bhczj9.jpg",
                            sourceUrl: musicOptions.url,
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                });
            } else {
                // Send audio from local file
                if (fs.existsSync(musicOptions.localPath)) {
                    const audioData = fs.readFileSync(musicOptions.localPath);
                    await zk.sendMessage(dest, {
                        audio: audioData,
                        mimetype: 'audio/mpeg',
                        ptt: false,
                        contextInfo: {
                            mentionedJid: [senderName],
                            externalAdReply: {
                                title: "CHARLES XMD MUSIC",
                                body: "Enjoy the theme music!",
                                thumbnailUrl: "https://files.catbox.moe/bhczj9.jpg",
                                sourceUrl: "https://files.catbox.moe/wxektf.mp3",
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    });
                } else {
                    console.log("⚠️ Local music file not found");
                }
            }
        }

        // Send menu first 
        await sendAudio();

        // Then send music
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
        repondre("⚠️ Menu error: " + error);
    }
});
