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
      return repondre("🤖 *Hello!*\nWhat question would you like to ask me? I'm powered by DeepSeek AI.");
    }

    const prompt = arg.join(' ');

    try {
      const res = await axios.post(
        'https://api.deepseek.com/v1/chat/completions',
        {
          model: 'deepseek-chat', // Updated to DeepSeek's official model
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 1000
        },
        {
          headers: {
            Authorization: 'Bearer sk-4c3305a5ee1440c48d4535e5be08db71', // 🔴 Replace with your actual API key
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
        text: `💡 *DeepSeek Response:*\n\n${replyText}`,
        contextInfo: {
          forwardingScore: 999,
          isForwarded: true,
          externalAdReply: {
            title: "DeepSeek AI",
            body: "🤖 Powered by DeepSeek API",
            mediaType: 1,
            thumbnailUrl: "", // Add a thumbnail URL if needed
            sourceUrl: "https://deepseek.com",
            renderLargerThumbnail: true
          },
          forwardedNewsletterMessageInfo: {
            newsletterJid: "",
            newsletterName: "DeepSeek AI"
          }
        }
      });

    } catch (error) {
      console.error("❗ DeepSeek API Error:", error.response?.data || error.message);
      return repondre("😌 Sorry, DeepSeek AI could not respond. Try again later.");
    }
  }
);
