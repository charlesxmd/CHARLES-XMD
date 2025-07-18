
```javascript
const { zokou } = require("../framework/zokou");
const { default: axios } = require('axios');

const CHARLES_XMD = "𝗖𝗛𝗔𝗥𝗟𝗘𝗦-𝗫𝗠𝗗"; // CHARLES-XMD in bold style

zokou({ nomCom: "spotify", categorie: 'General', reaction: "🎵" }, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  if (!arg || arg.length === 0) {
    const message = `
${CHARLES_XMD}

◈━━━━━━━━━━━━━━━━◈
│❒ 𝐏𝐥𝐞𝐚𝐬𝐞 𝐩𝐫𝐨𝐯𝐢𝐝𝐞 𝐚 𝐬𝐨𝐧𝐠 𝐧𝐚𝐦𝐞 🚫
│❒ 𝐄𝐱𝐚𝐦𝐩𝐥𝐞: .spotify 𝐓𝐡𝐞 𝐒𝐩𝐞𝐜𝐭𝐫𝐞
◈━━━━━━━━━━━━━━━━◈
    `;
    repondre(message);
    return;
  }

  const songName = arg.join(' ').trim();

  try {
    const mockTrackUrl = "https://open.spotify.com/track/0VjIjW4M7f9DrlbszDHL0";
    const apiUrl = `https://api.giftedtech.web.id/api/download/spotifydl?apikey
