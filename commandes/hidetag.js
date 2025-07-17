const { zokou } = require('../framework/zokou');

zokou({
    nomCom: "hidetag",
    categorie: "Group",
    reaction: "📣",
    description: "To Tag all Members for Any Message/Media",
    alias: ["tag", "h"],
    utilisation: '.hidetag Hello',
    filename: __filename
}, async (dest, zk, commandeOptions) => {
    const { auteurMsg, repondre, ms, arg, repondreMessage, membreGroupe, estAdmin, estProprietaire, participants } = commandeOptions;

    try {
        const isUrl = (url) => {
            return /https?:\/\/(www\.)?[\w\-@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([\w\-@:%_\+.~#?&//=]*)/.test(url);
        };

        if (!membreGroupe) return repondre("❌ This command can only be used in groups.");
        if (!estAdmin && !estProprietaire) return repondre("❌ Only group admins can use this command.");

        const mentionAll = { mentions: participants.map(u => u.id) };

        // If no message or reply is provided
        if (!arg && !repondreMessage) {
            return repondre("❌ Please provide a message or reply to a message to tag all members.");
        }

        // If a reply to a message
        if (repondreMessage) {
            const type = repondreMessage.mtype || '';
            
            // If it's a text message (extendedTextMessage)
            if (type === 'extendedTextMessage') {
                return await zk.sendMessage(dest, {
                    text: repondreMessage.text || 'No message content found.',
                    ...mentionAll
                }, { quoted: ms });
            }

            // Handle media messages
            if (['imageMessage', 'videoMessage', 'audioMessage', 'stickerMessage', 'documentMessage'].includes(type)) {
                try {
                    const buffer = await repondreMessage.download?.();
                    if (!buffer) return repondre("❌ Failed to download the quoted media.");

                    let content;
                    switch (type) {
                        case "imageMessage":
                            content = { image: buffer, caption: repondreMessage.text || "📷 Image", ...mentionAll };
                            break;
                        case "videoMessage":
                            content = { 
                                video: buffer, 
                                caption: repondreMessage.text || "🎥 Video", 
                                gifPlayback: repondreMessage.message?.videoMessage?.gifPlayback || false, 
                                ...mentionAll 
                            };
                            break;
                        case "audioMessage":
                            content = { 
                                audio: buffer, 
                                mimetype: "audio/mp4", 
                                ptt: repondreMessage.message?.audioMessage?.ptt || false, 
                                ...mentionAll 
                            };
                            break;
                        case "stickerMessage":
                            content = { sticker: buffer, ...mentionAll };
                            break;
                        case "documentMessage":
                            content = {
                                document: buffer,
                                mimetype: repondreMessage.message?.documentMessage?.mimetype || "application/octet-stream",
                                fileName: repondreMessage.message?.documentMessage?.fileName || "file",
                                caption: repondreMessage.text || "",
                                ...mentionAll
                            };
                            break;
                    }

                    if (content) {
                        return await zk.sendMessage(dest, content, { quoted: ms });
                    }
                } catch (e) {
                    console.error("Media download/send error:", e);
                    return repondre("❌ Failed to process the media. Sending as text instead.");
                }
            }

            // Fallback for any other message type
            return await zk.sendMessage(dest, {
                text: repondreMessage.text || "📨 Message",
                ...mentionAll
            }, { quoted: ms });
        }

        // If no quoted message, but a direct message is sent
        if (arg) {
            // If the direct message is a URL, send it as a message
            if (isUrl(arg)) {
                return await zk.sendMessage(dest, {
                    text: arg,
                    ...mentionAll
                }, { quoted: ms });
            }

            // Otherwise, just send the text without the command name
            await zk.sendMessage(dest, {
                text: arg, // Sends the message without the command name
                ...mentionAll
            }, { quoted: ms });
        }

    } catch (e) {
        console.error(e);
        repondre(`❌ *Error Occurred !!*\n\n${e.message}`);
    }
});
