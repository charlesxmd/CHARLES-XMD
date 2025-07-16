const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");

zokou({ nomCom: "repo", categorie: "General" }, async (dest, zk, commandeOptions) => {
  let { ms } = commandeOptions;

  try {
    const caption = `╭───❖「 *CHARLES-XMD BOT REPO* 」❖────⊷
│ 🧠 *GitHub:* https://github.com/charlesxmd/CHARLES-XMD
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

    await zk.sendMessage(dest, {
      text: caption,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        mentionedJid: ['1234567890@s.whatsapp.net'], // Replace with your channel JID
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

  } catch (e) {
    console.error("❌ Repo Command Error:", e);
    await zk.sendMessage(dest, { text: "❌ Error: " + e }, { quoted: ms });
  }
});
