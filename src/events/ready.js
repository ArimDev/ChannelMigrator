import { REST, Routes } from "discord.js";
import fs from "fs";
import path from "path";
import AsciiTable from "ascii-table";

export default async function (bot) {
    const cmds = [];
    bot.commands.forEach((value, key) => {
        if (value.slash) {
            cmds.push(value.slash);
        }
    });

    const rest = new REST().setToken(bot.token);

    try {
        await rest.put(
            Routes.applicationCommands(bot.user.id),
            { body: cmds },
        ).then(() => {
            const table = new AsciiTable('ChannelMigrator')
                .addRow("Bot Tag", bot.user.tag)
                .addRow("Ready", true)
                .addRow("Events", bot.events)
                .addRow("Commands", cmds.length)
                .setAlign(1, AsciiTable.CENTER);
            console.log(table.toString());
        });
    } catch (err) {
        console.log(err);
    };

    console.log("Waiting for interactions...");
}