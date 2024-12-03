import { EmbedBuilder, SlashCommandBuilder } from "discord.js";

export const slash = new SlashCommandBuilder()
    .setName("info")
    .setDescription("Info menu about the bot")
    .setContexts([0, 1, 2])
    .setIntegrationTypes([0, 1])
    .setNSFW(false);

export default async function run(bot, i) {
    function msToTime(ms) {
        const time = {
            day: Math.floor(ms / (24 * 60 * 60 * 1000)),
            hour: Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000)),
            minute: Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000)),
            second: Math.floor((ms % (60 * 1000)) / 1000),
        };

        let result = [];

        if (time.day) result.push(`${time.day} day${time.day > 1 ? "s" : ""}`);
        if (time.hour) result.push(`${time.hour} hour${time.hour > 1 ? "s" : ""}`);
        if (time.minute) result.push(`${time.minute} minute${time.minute > 1 ? "s" : ""}`);
        if (time.second) result.push(`${time.second} second${time.second > 1 ? "s" : ""}`);

        return result.length > 0 ? result.join(", ") : "0 seconds";
    }

    let helpEmbed = new EmbedBuilder()
        .setTitle("Bot Information")
        .setFields([
            {
                name: `Status`, inline: true,
                value:
                    `> **Ping:** \`${bot.ws.ping > 1 ? bot.ws.ping + " ms" : "N/A"}\``
                    + `\n> **Uptime:** \`${msToTime(bot.uptime)}\``
            },
            {
                name: `Info`, inline: false,
                value:
                    `> **Made by:** [ArimDev](https://github.com/ArimDev)`
                    + `\n> **Author:** [PetyXbron](https://github.com/PetyXbron)`
                    + `\n> **Source code:** [github.com](https://github.com/ArimDev/ChannelMigrator)`
            }
        ])
        .setColor(bot.CM.color)
        .setThumbnail(bot.user.avatarURL())
        .setFooter({ text: `ChannelMigrator v${bot.version} 🎯`, iconURL: bot.user.avatarURL() });

    return i.reply({ embeds: [helpEmbed], ephemeral: true });
}