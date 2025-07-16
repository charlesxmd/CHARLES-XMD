const { Sticker, createSticker, StickerTypes } = require('wa-sticker-formatter');
const { zokou } = require("../framework/zokou");
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const { Catbox } = require('node-catbox');
const conf = require("../set");

const catbox = new Catbox();

async function uploadToCatbox(Path) {
    if (!fs.existsSync(Path)) {
        throw new Error("File does not exist");
    }

    try {
        const response = await catbox.uploadFile({ path: Path });
        if (response) {
            return response;
        } else {
            throw new Error("Error retrieving the file link");
        }
    } catch (err) {
        throw new Error(String(err));
    }
}

async function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat("mp3")
            .on("error", (err) => reject(err))
            .on("end", () => resolve(outputPath))
            .save(outputPath);
    });
}

zokou({ nomCom: "url", categorie: "General", reaction: "🖇️" }, async (dest, zk, commandeOptions) => {
    const { ms, msgRepondu, repondre } = commandeOptions;

    if (!msgRepondu) {
        await zk.sendMessage(dest, {
            text: 'Please reply to an image, video, or audio file.',
            contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363351653122969@newsletter",
                    serverMessageId: "",
                },
                externalAdReply: {
                    title: "Charless URL Generator",
                    body: "Charles xmd Bot by charles",
                    thumbnailUrl: conf.LOGO,
                    mediaType: 1,
                    mediaUrl: conf.URL,
                    sourceUrl: conf.GURL,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                },
                mentionedJid: [],
            }
        }, { quoted: ms });
        return;
    }

    let mediaPath, mediaType;

    try {
        if (msgRepondu.videoMessage) {
            const videoSize = msgRepondu.videoMessage.fileLength;
            if (videoSize > 50 * 1024 * 1024) {
                await zk.sendMessage(dest, {
                    text: 'The video is too long. Please send a smaller video.',
                    contextInfo: {
                        forwardingScore: 9999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: "120363351653122969@newsletter",
                            serverMessageId: "",
                        },
                        externalAdReply: {
                            title: "charles URL Generator",
                            body: "charles xmd Bot by charles",
                            thumbnailUrl: conf.LOGO,
                            mediaType: 1,
                            mediaUrl: conf.URL,
                            sourceUrl: conf.GURL,
                            renderLargerThumbnail: true,
                            showAdAttribution: true,
                        },
                        mentionedJid: [],
                    }
                }, { quoted: ms });
                return;
            }
            mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
            mediaType = 'video';
        } else if (msgRepondu.imageMessage) {
            mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
            mediaType = 'image';
        } else if (msgRepondu.audioMessage) {
            mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
            mediaType = 'audio';

            const outputPath = `${mediaPath}.mp3`;
            await convertToMp3(mediaPath, outputPath);
            fs.unlinkSync(mediaPath);
            mediaPath = outputPath;
        } else {
            await zk.sendMessage(dest, {
                text: 'Unsupported media type. Reply with an image, video, or audio file.',
                contextInfo: {
                    forwardingScore: 9999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363351653122969@newsletter",
                        serverMessageId: "",
                    },
                    externalAdReply: {
                        title: "Charles xmd URL Generator",
                        body: "Charles xmd Bot by charles",
                        thumbnailUrl: conf.LOGO,
                        mediaType: 1,
                        mediaUrl: conf.URL,
                        sourceUrl: conf.GURL,
                        renderLargerThumbnail: true,
                        showAdAttribution: true,
                    },
                    mentionedJid: [],
                }
            }, { quoted: ms });
            return;
        }

        const catboxUrl = await uploadToCatbox(mediaPath);
        fs.unlinkSync(mediaPath);

        await zk.sendMessage(dest, {
            text: `Charles xmd url: ${catboxUrl}`,
            contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363351653122969@newsletter",
                    serverMessageId: "",
                },
                externalAdReply: {
                    title: "Click to open URL",
                    body: "Uploaded via Charles xmd Bot",
                    thumbnailUrl: conf.LOGO,
                    mediaType: 1,
                    mediaUrl: conf.URL,
                    sourceUrl: catboxUrl,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                },
                mentionedJid: [],
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("Upload/Convert error:", error);
        await zk.sendMessage(dest, {
            text: 'Oops, an error occurred while processing.',
            contextInfo: {
                forwardingScore: 9999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363351653122969@newsletter",
                    serverMessageId: "",
                },
                externalAdReply: {
                    title: "Charles URL Generator",
                    body: "Charles xmd Bot by charles",
                    thumbnailUrl: conf.LOGO,
                    mediaType: 1,
                    mediaUrl: conf.URL,
                    sourceUrl: conf.GURL,
                    renderLargerThumbnail: true,
                    showAdAttribution: true,
                },
                mentionedJid: [],
            }
        }, { quoted: ms });
    }
});
                        
