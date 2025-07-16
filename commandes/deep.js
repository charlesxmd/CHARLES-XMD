const { zokou } = require('../framework/zokou');
const axios = require('axios');
const { default: makeWASocket, generateWAMessageFromContent, proto } = require('@whiskeysockets/baileys');

zokou(
  {
    nomCom: "deepseek",
    reaction: "💫",
    categorie: "ai"
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, arg } = commandeOptions;

    if (!arg || arg.length === 0) {
      return repondre("🤖 *Hello!*\nWhat question would you like to ask me am from deepseek my owner is Charles?");
    }

    const prompt = arg.join(' ');

    try {
      const res = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: 'Bearer sk-4c3305a5ee1440c48d4535e5be08db71',
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      const replyText = res.data?.choices?.[0]?.message?.content?.trim();

      if (!replyText) {
        return repondre("⚠️ I didn’t receive a valid response. Try rephrasing your question.");
      }

      // Final response in forwarded newsletter format
      await zk.sendMessage(dest, {
        text: `💡 *Deepseek Response:*\n\n${replyText}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "CHARLES XMD",
            body: "🤖 powered by Charles",
            mediaType: 1,
            thumbnailUrl: "",
            sourceUrl: "https://api.deepseek.com/v1",
            renderLargerThumbnail: true
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "",
            newsletterName: "CHARLES XMD"
          }
        }
      });

    } catch (error) {
      console.error("❗ deepseek Error:", error.response?.data || error.message);
      return repondre("😌 Sorry, Deepseek could not respond. Try again later.");
    }
  }
);
