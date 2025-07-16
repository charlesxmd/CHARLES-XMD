const { zokou } = require("../framework/zokou");
const DeviceDetector = require('device-detector-js'); // Install via: npm install device-detector-js

zokou({ 
    nomCom: "device", 
    categorie: "Tools", 
    reaction: "📱" 
}, async (dest, zk, commandeOptions) => {
    const { repondre, msg, auteurMsg } = commandeOptions;

    // Get User-Agent from WhatsApp Web/App headers
    const userAgent = msg?.headers?.['user-agent'] || "Unknown";

    // Parse device info
    const detector = new DeviceDetector();
    const result = detector.parse(userAgent);

    // Custom response based on detection
    let deviceInfo = "❌ *Could not detect device.*";
    
    if (result.device?.type) {
        deviceInfo = `📱 *Device Type:* ${result.device.type}\n` +
                     `🏷️ *Brand:* ${result.device.brand || "Unknown"}\n` +
                     `🛠️ *Model:* ${result.device.model || "Unknown"}\n` +
                     `⚙️ *OS:* ${result.os?.name || "Unknown"} ${result.os?.version || ""}\n` +
                     `🌐 *Browser:* ${result.client?.name || "WhatsApp"}`;
    }

    await repondre(
        `*📲 DEVICE INFO*\n\n` +
        `${deviceInfo}\n\n` +
        `_🔍 Detected from User-Agent_`
    );
});
