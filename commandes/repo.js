const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");
const fs = require('fs');
const axios = require('axios'); // For downloading music if needed

zokou({ nomCom: "repo", categorie: "General" }, async (dest, zk, commandeOptions) => {
  let { ms } = commandeOptions;

  try {
    const caption = `╭───❖「 *CHARLES-XMD BOT REPO* 」❖────⊷
│ � *GitHub:* https://github.com/charlesxmd/CHARLES-XMD
│ ⭐ *Stars:* 74    🍴 *Forks:* 2112
│ 📦 *Base:* Zokou Multi-Device
│ 👨‍💻 *Dev:* Charles XMD 🇰🇪
╰─────────────────────────────⬍

🚀 *Want to deploy it yourself?*
▸ Heroku: https://heroku.com
▸ Render: https://render.com
▸ Railway: https://railway.app
▸ Panel: use Node.js panel or cpanel with pm2

🌟 Fork the repo, edit config and start building your own WhatsApp bot!`;

    // Send the text message with externalAdReply (as before)
    await zk.sendMessage(dest, {
      text: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: ['120363351653122969@newsletter'], // Replace with your channel JID
        externalAdReply: {
          title: "CHARLES-XMD • Public WhatsApp Bot",
          body: "Click to view the GitHub repo",
          thumbnailUrl: conf.URL || "https://files.catbox.moe/jv5s3i.jpg", // fallback thumbnail
          mediaType: 1,
          renderLargerThumbnail: true,
          showAdAttribution: true,
          sourceUrl: "https://github.com/charlesxmd/CHARLES-XMD"
        }
      }
    }, {
      quoted: {
        key: {
          fromMe: false,
          participant: '0@s.whatsapp.net',
          remoteJid: 'status@broadcast' // Makes it appear as a broadcast
        },
        message: {
          contactMessage: {
            displayName: "Charles XMD • Verified",
            vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Charles XMD\nORG:;\nTEL;type=CELL;type=VOICE;waid=254700000000:+254 700 000000\nEND:VCARD`
          }
        }
      }
    });

    // 🎵 Now send a music file (MP3) along with the repo info
    const musicUrl = "https://files.catbox.moe/wxektf.mp3"; // Replace with your music URL
    const musicBuffer = await axios.get(musicUrl, { responseType: 'arraybuffer' })
      .then(res => Buffer.from(res.data, 'binary'))
      .catch(() => null);

    if (musicBuffer) {
      await zk.sendMessage(dest, {
        audio: musicBuffer,
        mimetype: 'audio/mpeg',
        ptt: false,
        contextInfo: {
          externalAdReply: {
            title: "🎶 CHARLES-XMD Bot Music",
            body: "Enjoy this track while exploring the repo!",
            thumbnailUrl: conf.URL || "https://files.catbox.moe/jv5s3i.jpg",
            sourceUrl: "https://github.com/charlesxmd/CHARLES-XMD"
          }
        }
      });
    } else {
      console.log("⚠️ Music file could not be loaded.");
    }

  } catch (e) {
    console.error("❌ Repo Command Error:", e);
    await zk.sendMessage(dest, { text: "❌ Error: " + e }, { quoted: ms });
  }
});
