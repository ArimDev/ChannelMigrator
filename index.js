console.log("ChannelMigrator started!");

import packageJson from "./package.json" assert { type: "json" };
import dotenv from "dotenv";
dotenv.config();

import { Client, Collection, GatewayIntentBits, Partials } from "discord.js";

let bot = new Client({
    partials: [
        Partials.Channel,
        Partials.User,
        Partials.GuildMember,
        Partials.ThreadMember,
        Partials.Message
    ],
    intents: [
        GatewayIntentBits.MessageContent
    ]
});

bot.commands = new Collection();
bot.events = 0;
bot.CM = new Object();
bot.version = packageJson.version;

bot.CM.color = "#8261c2";

import setupHandlers from "./src/functions/handlers.js";
setupHandlers(bot);

bot.login(process.env.token);

export { bot };