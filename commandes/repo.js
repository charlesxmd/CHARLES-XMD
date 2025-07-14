const { zokou } = require(__dirname + "/../framework/zokou");
const conf = require(__dirname + "/../set");

zokou({ nomCom: "repo", categorie: "General" }, async (dest, zk, commandeOptions) => {
  let { ms } = commandeOptions;

  try {
    await zk.sendMessage(dest, {
      text: `🚀 *CHARLES-XMD GitHub Repository*\n\n🔗 *Link:* https://github.com/charlesxmd/CHARLES-XMD\n\nThis is the official source code for the CHARLES-XMD WhatsApp bot. You’re welcome to explore, use, or contribute to it.\n\n🛠️ *Developer:* Charles XMD\n📦 *Bot Framework:* Zokou`,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363351653122969@newsletter',
          newsletterName: 'CHARLES XMD',
          serverMessageId: 200
        },
        externalAdReply: {
          title: "Official CHARLES-XMD GitHub Repo",
          body: "Tap here to open the source code",
          thumbnailUrl: conf.URL, // Use your bot thumbnail here
          sourceUrl: "https://github.com/charlesxmd/CHARLES-XMD",
          mediaType: 1
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.error("❌ Repo Command Error:", e);
    await zk.sendMessage(dest, { text: "❌ Error: " + e }, { quoted: ms });
  }
});
