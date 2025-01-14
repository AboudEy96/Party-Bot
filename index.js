const { Client, GatewayIntentBits } = require("discord.js");
const Party = require('./Party');
const PartyManager = require('./PartyManager');

const token = 'bot-token';
const partyManager = new PartyManager();

inParty = []
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.once('ready', () => {
    console.log("Online");
});

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    if (message.content === "!createparty") {
        const response = partyManager.createParty(message.author);
        inParty.push(message.author);
        message.reply(response);
    }

    if (message.content === "!showmembers") {
        const embed = partyManager.showPartyMembersEmbed(message.author); // التأكد من استدعاء showPartyMembersEmbed
        if (typeof embed === 'string') {
            return message.reply(embed); // إذا كانت الإجابة عبارة عن نص، نعرضها مباشرة
        }
        message.reply({embeds: [embed]}); // إرسال الـ Embed
    }

    if (message.content.startsWith("!addmember")) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("mention a member to invite");

        if (inParty.includes(user)) return  message.reply(user.toString() + "already in party")
        const response = partyManager.addMemberToParty(message.author, user);
        inParty.push(user);
        message.reply(response);
    }

    if (message.content.startsWith("!removemember")) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("Please mention a user to remove.");
        const response = partyManager.removeMemberFromParty(message.author, user);
        inParty.remove(user)
        message.reply(response);
    }
});

client.login(token);
