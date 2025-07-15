const util = require('util');
const fs = require('fs-extra');
const axios = require('axios');
const { zokou } = require("../framework/zokou");
const os = require('os');
const moment = require('moment-timezone');
const conf = require(__dirname + '/../set');

moment.tz.setDefault(conf.TZ);
const AUDIO_URL = '';

// Allowed country codes
const allowedCodes = ['91', '91', '233', '92']; // You can add or remove codes here

function getTimeAndDate() {
  const time = moment().format("HH:mm:ss");
  const date = moment().format("YYYY-MM-DD");
  return { time, date };
}

zokou({
  nomCom: "antifake",
  categorie: "🛡️ Security"
}, async (dest, zk, commandeOptions) => {
  const { ms, arg } = commandeOptions;
  const { time, date } = getTimeAndDate();
  const path = `./database/antifake/${dest}.json`;

  if (!ms.key.fromMe) return;

  if (arg[0] === "on") {
    await fs.ensureFile(path);
    await fs.writeJson(path, { status: true, allowed: allowedCodes });
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AntiFake Activated",
          body: `${date} | ${time}`,
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: 'https://github.com/Charlesofficial01'
        }
      }
    }, { quoted: ms });

  } else if (arg[0] === "off") {
    await fs.remove(path);
    await zk.sendMessage(dest, {
      audio: { url: AUDIO_URL },
      mimetype: 'audio/mp4',
      ptt: true,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AntiFake Deactivated",
          body: `${date} | ${time}`,
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: ''
        }
      }
    }, { quoted: ms });

  } else {
    await zk.sendMessage(dest, {
      text: "Usage: .antifake on/off\nAllowed Codes: " + allowedCodes.join(", "),
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        externalAdReply: {
          title: "AntiFake Filter",
          body: "Removes numbers outside allowed countries",
          thumbnailUrl: 'https://telegra.ph/file/abcd1234.jpg',
          mediaType: 1,
          renderLargerThumbnail: true,
          sourceUrl: ''
        }
      }
    }, { quoted: ms });
  }
});
