import axios from "axios";
import config from '../config.cjs';

const repo = async (m, gss) => {
  const prefix = config.PREFIX;
  const cmd = m.body.startsWith(prefix) ? m.body.slice(prefix.length).split(" ")[0].toLowerCase() : "";

  if (["repo", "sc", "script", "info"].includes(cmd)) {
    const githubRepoURL = "https://github.com/tonicmeef/TONIC-MD";

    try {
      // Extract username and repo name from the URL
      const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

      // Fetch repository details using GitHub API
      const response = await axios.get(`https://api.github.com/repos/${username}/${repoName}`);

      if (!response.data) {
        throw new Error("GitHub API request failed.");
      }

      const repoData = response.data;

      // Format the repository information
      const formattedInfo = `╭──────────────━⊷
┊ 🤖 ᴛᴏɴɪᴄ-ᴍᴅ ʀᴇᴘᴏ ɪɴғᴏ 🤖
╰──────────────━⊷
╭──────────────━⊷
║💡 *ɴᴀᴍᴇ:* ${repoData.name}
║👤 *ᴏᴡɴᴇʀ:* ᴛᴏɴɪᴄ ᴍᴜɴᴏᴅᴀᴡᴀғᴀ
║⭐ *ᴛᴏᴛᴀʟ sᴛᴀʀs:* ${repoData.stargazers_count}
║🍴 *ᴅᴀɪʟʏ ᴜsᴇʀs:* ${repoData.forks_count}
║🔗 *ɢɪᴛʜᴜʙ ʟɪɴᴋ:*  ${repoData.html_url}
║❗ *ᴅᴇsᴄʀɪᴘᴛɪᴏɴ:*  ${repoData.description || "No description"}
╰──────────────━⊷

 ᴅᴏɴᴛ ғᴏʀɢᴇᴛ ᴛᴏ sᴛᴀʀ & ғᴏʀᴋ ᴛʜᴇ ʀᴇᴘᴏ🌟
 
> *© Pᴏᴡᴇʀᴇᴅ Bʏ Tᴏɴɪᴄ Tᴇᴄʜ Iɴᴄ.♡*`;

      // Send an image with the formatted info as a caption
      await gss.sendMessage(
        m.from,
        {
          image: { url: "https://files.catbox.moe/ydk0a8.jpg" },
          caption: formattedInfo,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363374632065395@newsletter",
              newsletterName: "Tᴏɴɪᴄ Tᴇᴄʜ Iɴᴄ.",
              serverMessageId: 143,
            },
          },
        },
        { quoted: m }
      );

      // Send the audio file with context info
      await gss.sendMessage(
        m.from,
        {
          audio: { url: null },
          mimetype: "audio/mp4",
          ptt: true,
          contextInfo: {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363374632065395@newsletter",
              newsletterName: "Tᴏɴɪᴄ Tᴇᴄʜ Iɴᴄ.",
              serverMessageId: 143,
            },
          },
        },
        { quoted: m }
      );
    } catch (error) {
      console.error("Error in repo command:", error);
      m.reply("Sorry, something went wrong while fetching the repository information. Please try again later.");
    }
  }
};

export default repo;