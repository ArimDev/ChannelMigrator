import { AttachmentBuilder, PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const slash = new SlashCommandBuilder()
    .setName("export")
    .setDescription("Export messages to a file")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setNSFW(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addChannelOption(option =>
        option.setName("source")
            .setDescription("Source channel")
            .setRequired(false));

export default async function run(bot, i) {
    const channel = i.options.getChannel("channel") || i.channel;

    let allMessages = [];
    let lastMessageId = null;

    const start = process.hrtime();

    await i.deferReply({ content: "🔁 **Exporting messages...**", ephemeral: true });
    while (true) {
        const options = { limit: 100 };
        if (lastMessageId) options.before = lastMessageId;

        const messages = await channel.messages.fetch(options);

        if (messages.size === 0) break;

        allMessages = [...allMessages, ...messages.values()];
        lastMessageId = messages.last().id;
    }

    const messagesJson = allMessages.map(msg => ({
        timestamp: msg.createdTimestamp,
        author: {
            displayName: msg.author.displayName,
            avatar: msg.author.displayAvatarURL()
        },
        content: msg.content,
        attachments: msg.attachments.map(att => att.url)
    })).sort((a, b) => b.timestamp - a.timestamp);

    const att = new AttachmentBuilder(Buffer.from(JSON.stringify(messagesJson, null, 4)), { name: `${channel.name}.json` });

    const end = process.hrtime(start);

    return i.editReply({ content: `✅ **Messages** (${allMessages.length}) **exported!** (in ${end[0]} seconds)`, files: [att], ephemeral: true });
}