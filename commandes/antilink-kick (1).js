const { cmd } = require('../framework/command');
const config = require("../config");

// Anti-Link System
const linkPatterns = [
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,
  /wa\.me\/\S+/gi,
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
  /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
  /https?:\/\/youtu\.be\/\S+/gi,
  /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
  /https?:\/\/fb\.me\/\S+/gi,
  /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
  /https?:\/\/ngl\/\S+/gi,
  /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
  /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

cmd({
  on: "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  groupAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!isGroup) return;
    if (!isBotAdmins) return; // Bot must be admin

    // groupAdmins is an array of admin IDs, check if sender is admin
    const isSenderAdmin = groupAdmins && groupAdmins.includes(sender);

    if (isSenderAdmin) return; // Don't kick admins

    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (containsLink && config.ANTI_LINK_KICK === 'true') {
      // Optional: Delete message (if your lib supports)
      try {
        await conn.sendMessage(from, { delete: m.key });
      } catch (e) {
        // ignore if can't delete
      }

      // Kick user
      await conn.groupParticipantsUpdate(from, [sender], "remove");

      // Send warning
      await conn.sendMessage(from, {
        text: `⚠️ Links are not allowed in this group.\n@${sender.split('@')[0]} has been removed. 🚫`,
        mentions: [sender]
      });
    }
  } catch (error) {
    console.error(error);
    reply("An error occurred while processing the message.");
  }
});
