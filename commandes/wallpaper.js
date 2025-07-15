const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require(__dirname + "/../framework/zokou");
const os = require("os");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");
const AUDIO_URL = "https://github.com/mp3";
const THUMBNAIL_URL = "https://efs/hea";

moment.tz.setDefault(`${conf.TZ}`);

const getTimeAndDate = () => {
    return {
        time: moment().format('HH:mm:ss'),
        date: moment().format('DD/MM/YYYY')
    };
};

zokou({ nomCom: "wallpaper", categorie: "Media" }, async (dest, zk, commandeOptions) => {
    const { ms, arg } = commandeOptions;
    const { time, date } = getTimeAndDate();
    const keyword = arg.length > 0 ? arg.join(" ") : "wallpaper,nature,art,abstract";

    try {
        const encoded = encodeURIComponent(keyword);
        const res = await axios.get(`https://source.unsplash.com/1080x1920/?${encoded}`);
        const imageUrl = res.request.res.responseUrl;

        await zk.sendMessage(dest, {
            image: { url: imageUrl },
            caption: `🖼️ *Wallpaper Found!*\n\n🎯 *Search:* ${keyword}\n📅 *Date:* ${date}\n⏰ *Time:* ${time}\n🔗 *Source:* Unsplash`,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363351653122969@newsletter',
                    newsletterName: 'CHARLES XMD',
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `Wallpaper: ${keyword}`,
                    body: "HD wallpaper delivered by CHARLES XMD",
                    thumbnailUrl: THUMBNAIL_URL,
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    sourceUrl: conf.GURL
                }
            }
        }, { quoted: ms });

        await zk.sendMessage(dest, {
            audio: { url: AUDIO_URL },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: ms });

    } catch (e) {
        console.log("❌ Wallpaper Command Error: " + e);
        await zk.sendMessage(dest, { text: "❌ Failed to fetch wallpaper." }, { quoted: ms });
    }
});
                  
