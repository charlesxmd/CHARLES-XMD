const { zokou } = require("../framework/zokou");
const DeviceDetector = require('device-detector-js'); // Install via: npm install device-detector-js

module.exports = {
    name: "device", // Command name
    description: "Detects the user's device, OS, and browser.", // Command description
    category: "Tools", // Command category
    reaction: "📱", // Emoji reaction
    async execute(dest, zk, commandeOptions) {
        const { repondre, msg, auteurMsg } = commandeOptions;

        // Get User-Agent from WhatsApp headers
        const userAgent = msg?.headers?.['user-agent'] || "Unknown";

        // Parse device info
        const detector = new DeviceDetector();
        const result = detector.parse(userAgent);

        // Custom response based on detection
        let deviceInfo = "❌ *Could not detect device.*";
        
        if (result.device?.type) {
            deviceInfo = `
📱 *Device Type:* ${result.device.type || "Unknown"}
🏷️ *Brand:* ${result.device.brand || "Unknown"}
🛠️ *Model:* ${result.device.model || "Unknown"}
⚙️ *OS:* ${result.os?.name || "Unknown"} ${result.os?.version || ""}
🌐 *Browser:* ${result.client?.name || "WhatsApp"}`;
        }

        // Reply with device info
        await repondre(
            `*📲 DEVICE INFORMATION*\n\n` +
            `${deviceInfo}\n\n` +
            `_🔍 Detected from User-Agent_`
        );
    }
};
