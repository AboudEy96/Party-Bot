const { Client, GatewayIntentBits } = require("discord.js");
const Party = require('./Party');
const PartyManager = require('./PartyManager');
const RoomManagments = require('./RoomManagments');
const token = 'tokenhere';
const partyManager = new PartyManager();
const roomManagment = new RoomManagments();
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

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content === "!createparty") {
        try {
            const response = await partyManager.createParty(message.author, message);
            console.log("Create Party Response:", response); // Log the response
            if (!response) {
                message.reply("An unexpected error occurred while creating the party.");
            } else {
                inParty.push(message.author);
                message.reply(response);
            }
        } catch (error) {
            console.error("Error creating party:", error);
            message.reply("An error occurred while creating the party.");
        }
    }

    if (message.content === "!showmembers") {
        const embed = partyManager.showPartyMembersEmbed(message.author); // التأكد من استدعاء showPartyMembersEmbed
        if (typeof embed === 'string') {
            return message.reply(embed); // إذا كانت الإجابة عبارة عن نص، نعرضها مباشرة
        }
        message.reply({ embeds: [embed] }); // إرسال الـ Embed
    }

    if (message.content.startsWith("!addmember")) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("mention a member to invite");

        if (inParty.includes(user)) return message.reply(user.toString() + "already in party");
        const response = partyManager.addMemberToParty(message.author, user);
        if (!response) {
            message.reply("An unexpected error occurred while adding the member.");
        } else {
            inParty.push(user);
            message.reply(response);
        }
    }

    if (message.content.startsWith("!removemember")) {
        const user = message.mentions.users.first();
        if (!user) return message.reply("Please mention a user to remove.");
        const response = partyManager.removeMemberFromParty(message.author, user);
        if (!response) {
            message.reply("An unexpected error occurred while removing the member.");
        } else {
            inParty.splice(inParty.indexOf(user), 1);
            message.reply(response);
        }
    }
    if (message.content.startsWith("!leaveparty")) {
        const user = message.author;
        const response = partyManager.leaveMemberFromParty(message.author);
        if (!response) {
            message.reply("An unexpected error occurred while leaving the party.");
        } else {
            inParty.splice(inParty.indexOf(user), 1);
            message.reply(response);
        }

    }
});

client.login(token);
