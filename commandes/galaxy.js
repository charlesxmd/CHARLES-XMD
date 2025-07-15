'use strict';

Object.defineProperty(exports, '__esModule', {
  'value': true
});
const {
  zokou
} = require("../framework/zokou");
zokou({
  'nomCom': 'galax',
  'reaction': '🌌',
  'nomFichier': __filename
}, async (_0x1504b9, _0xd75a81, _0x3fbd91) => {
  console.log("Commande saisie !!!s");
  await _0xd75a81.sendMessage(_0x1504b9, {
    'image': {
      'url': "https://files.catbox.moe/rln1f8.jpg"
    },
    'caption': "𝗛𝗘𝗟𝗟𝗢 👋  \n\n AM CHARLES-XMD                                        The galaxy is so favourable, wish you could be here"
  });
});
console.log("mon test");
