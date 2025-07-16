const { zokou } = require("../framework/zokou");
const axios = require("axios");
const fs = require("fs-extra");
const FormData = require("form-data");
const ytdl = require("@neoxr/ytb"); // For YouTube (alternative: "ytdl-core")

module.exports = {
   name: "video",
   description: "Download videos from YouTube/Instagram/TikTok/Facebook",
   category: "Media",
   usage: "video <link>",
   async execute(commandOptions) {
      const { zk, dest, repondre, arg, ms } = commandOptions;

      if (!arg[0]) {
         return repondre("❌ Please provide a video link!\nExample: *!video https://youtube.com/...*");
      }

      const url = arg.join(" ");
      let videoBuffer, fileName;

      try {
         await repondre("⏳ Downloading your video...");

         if (url.includes("youtube.com") || url.includes("youtu.be")) {
            // YouTube Downloader
            const ytInfo = await ytdl.getInfo(url);
            const format = ytInfo.video
               .sort((a, b) => b.quality - a.quality)[0]; // Best quality
            videoBuffer = await ytdl.downloadFromUrl(format.url);
            fileName = `yt_${Date.now()}.mp4`;
         } 
         else if (url.includes("instagram.com")) {
            // Instagram Downloader
            const apiUrl = `https://api.vevioz.com/api/button/instagram?url=${encodeURIComponent(url)}`;
            const response = await axios.get(apiUrl);
            const videoUrl = response.data.url;
            const videoRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
            videoBuffer = Buffer.from(videoRes.data);
            fileName = `ig_${Date.now()}.mp4`;
         } 
         else if (url.includes("tiktok.com")) {
            // TikTok Downloader
            const apiUrl = `https://api.tiklydown.eu.org/api/download?url=${encodeURIComponent(url)}`;
            const response = await axios.get(apiUrl);
            const videoUrl = response.data.video.noWatermark;
            const videoRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
            videoBuffer = Buffer.from(videoRes.data);
            fileName = `tiktok_${Date.now()}.mp4`;
         } 
         else if (url.includes("facebook.com")) {
            // Facebook Downloader
            const apiUrl = `https://api.vevioz.com/api/button/facebook?url=${encodeURIComponent(url)}`;
            const response = await axios.get(apiUrl);
            const videoUrl = response.data.url;
            const videoRes = await axios.get(videoUrl, { responseType: "arraybuffer" });
            videoBuffer = Buffer.from(videoRes.data);
            fileName = `fb_${Date.now()}.mp4`;
         } 
         else {
            return repondre("❌ Unsupported link! Only YouTube/Instagram/TikTok/Facebook are supported.");
         }

         // Send the video
         await zk.sendMessage(dest, {
            video: videoBuffer,
            caption: `✅ *Downloaded Successfully!*\n📌 *Source:* ${url}`,
            fileName: fileName,
            mimetype: "video/mp4",
         });

      } catch (error) {
         console.error("Video Download Error:", error);
         repondre("❌ Failed to download video. Please try another link or check if it's private.");
      }
   },
};
