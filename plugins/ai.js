import axios from "axios";
import config from "../config.cjs";

const aiCommand = async (m, Matrix) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";
  const query = m.body.slice(prefix.length + cmd.length).trim();

  if (!["ai", "gpt","tonic","meta"].includes(cmd)) return;

  if (!query) {
    return Matrix.sendMessage(m.from, { text: "❌ *Usage:* `.ai [your question or prompt]`" }, { quoted: m });
  }

  try {
    await Matrix.sendMessage(m.from, { react: { text: "🤖", key: m.key } });

    const apiUrl = `https://lance-frank-asta.onrender.com/api/gpt?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);
    
    if (!response.data) {
      await Matrix.sendMessage(m.from, { react: { text: "❌", key: m.key } });
      return Matrix.sendMessage(m.from, { text: "❌ Failed to get a response. Please try again later." }, { quoted: m });
    }

    const aiResponse = response.data.message || "No response received.";
    const author = response.data.author || "AI";
    
    const formattedResponse = `*🤖 AI Response*\n\n${aiResponse}\n\n👤 *Author:* ${author}\n🔗 > *© Pᴏᴡᴇʀᴇᴅ Bʏ Tᴏɴɪᴄ Tᴇᴄʜ Iɴᴄ.♡*`;
    
    await Matrix.sendMessage(
      m.from,
      { 
        text: formattedResponse,
        contextInfo: {
          mentionedJid: [m.sender],
          forwardingScore: 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363374632065395@newsletter',
            newsletterName: "Tᴏɴɪᴄ Tᴇᴄʜ Iɴᴄ.",
            serverMessageId: 143
          }
        }
      },
      { quoted: m }
    );

    await Matrix.sendMessage(m.from, { react: { text: "✅", key: m.key } });
    
  } catch (error) {
    console.error("AI Command Error:", error);
    Matrix.sendMessage(
      m.from, 
      { text: "❌ *An error occurred while processing your request. Please try again later.*" }, 
      { quoted: m }
    );
  }
};

export default aiCommand;
