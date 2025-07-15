const axios = require("axios");
const fs = require("fs-extra");
const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ);

// Map of supported celebrity voices (mock voice IDs or tags)
const voiceMap = {
  obama: "barack-obama",
  trump: "donald-trump",
  morgan: "morgan-freeman",
  eminem: "eminem",
  elon: "elon-musk",
  kanye: "kanye-west"
};

zokou({
  nomCom: "aivoice",
  categorie: "ai-tools"
}, async (dest, zk, { ms, arg }) => {
  const voiceKey = arg[0]?.toLowerCase();
  const text = arg.slice(1).join(" ");

  if (!voiceKey || !text) {
    return zk.sendMessage(dest, {
      text: `🎙️ *Usage:* .aivoice <voice> <text>\n\n*Example:*\n.aivoice obama Hello my people!`,
      contextInfo: getContext()
    }, { quoted: ms });
  }

  const voiceId = voiceMap[voiceKey];
  if (!voiceId) {
    return zk.sendMessage(dest, {
      text: `❌ *Unsupported voice.*\n\n*Available voices:* ${Object.keys(voiceMap).join(", ")}`,
      contextInfo: getContext()
    }, { quoted: ms });
  }

  try {
    // Example: Use a public Hugging Face-hosted voice-clone endpoint (mocked here)
    const apiUrl = `https://api.fakeyvoices.tech/clone`; // Replace with real clone API
    const response = await axios.post(apiUrl, {
      voice: voiceId,
      text
    }, { responseType: "arraybuffer" });

    const outputPath = "./voice_clone.mp3";
    await fs.writeFile(outputPath, response.data);

    await zk.sendMessage(dest, {
      audio: fs.readFileSync(outputPath),
      mimetype: "audio/mp4",
      ptt: false,
      contextInfo: getContext()
    }, { quoted: ms });

    await fs.unlink(outputPath).catch(() => {});
  } catch (err) {
    console.error(err);
    return zk.sendMessage(dest, {
      text: `❌ Failed to generate voice. Try again later or use shorter text.`,
      contextInfo: getContext()
    }, { quoted: ms });
  }
});

function getContext() {
  return {
    forwardingScore: 999,
    isForwarded: true,
    externalAdReply: {
      title: "AI Voice Cloner",
      mediaUrl: conf.URL,
      sourceUrl: conf.GURL,
      thumbnailUrl: conf.LOGO
    },
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363351653122969@newsletter",
      newsletterName: "CHARLES XMD",
      serverMessageId: "15"
    }
  };
    }
      
