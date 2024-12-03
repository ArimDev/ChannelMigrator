import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

export const slash = new SlashCommandBuilder()
    .setName("import")
    .setDescription("Import messages to a file")
    .setContexts([0])
    .setIntegrationTypes([0])
    .setNSFW(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addAttachmentOption(option =>
        option.setName("file")
            .setDescription("Exported file")
            .setRequired(true))
    .addChannelOption(option =>
        option.setName("target")
            .setDescription("Target channel")
            .setRequired(false));

export default async function run(bot, i) {
    const channel = i.options.getChannel("channel") || i.channel;

    const res = await fetch(i.options.getAttachment("file").url);

    if (!res.ok) i.reply({ content: `🛑 Unexpected error! Sorry...`, ephemeral: true });

    const start = process.hrtime();
    const messagesJson = JSON.parse(await res.text());

    await i.reply({ content: "🔁 **Importing messages...**", ephemeral: true });

    const webhooks = await channel.fetchWebhooks();

    let webhook = webhooks.find(w => w.owner.id === bot.user.id);
    if (!webhook)
        webhook = await channel.createWebhook({
            name: "ChannelMigrator Importer",
            avatar: "https://i.imgur.com/SpyWXnY.png",
        });

    for (const { author, content, attachments } of messagesJson) {
        await webhook.send({
            content: content,
            files: attachments,
            username: author.displayName,
            avatarURL: author.avatar
        });
    }

    const end = process.hrtime(start);

    i.followUp({ content: `✅ **Messages imported!** (in ${end[0]} seconds)`, ephemeral: true });
    return;
}