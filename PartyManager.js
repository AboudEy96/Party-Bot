const { EmbedBuilder } = require('discord.js'); // EmbedBuilder like imports .
const Party = require('./Party');
const RoomManagments = require('./RoomManagments');
const roomManagment = new RoomManagments();
class PartyManager {
    constructor() {
        this.parties = new Map();
    }

    async createParty(leader, message) {
        if (this.parties.has(leader.id)) {
            return "You already have a party";
        }

        const newParty = new Party(leader);
        this.parties.set(leader.id, newParty);
        const roomManagement = await RoomManagments.createCategory(message.guild, leader.username);
        await roomManagement.addTextChannel(`${leader.username}-text`);
        await roomManagement.addVoiceChannel(`${leader.username}-voice`);


        return "Your party has been created successfully";
    }

    addMemberToParty(leader, user) {
        const party = this.parties.get(leader.id);
        if (!party) {
            return "You don't have a party";
        }

        if (party.leader.id !== leader.id) {
            return "Only the party leader can add members";
        }

        return party.addMember(user);
    }
    leaveMemberFromParty(user) {
        const party = this.parties.get(user.id);
        if (!party) return "You are not in party."
        if (party.leader.id === user.id) return "set a Leader before leaving your party."
        party.removeMember(user.id);
        return `You left from ${party.leader.toString()}'s party.`
    }

    removeMemberFromParty(leader, user) {
        const party = this.parties.get(leader.id);
        if (!party) {
            return "You dont have a party";
        }

        if (party.leader.id !== leader.id) {
            return "only the party leader can remove members";
        }

        return party.removeMember(user);
    }

    showPartyMembersEmbed(leader) {
        const party = this.parties.get(leader.id);
        if (!party) {
            return "You don't have a party";
        }
        const partyMembers = party.members
            .filter(member => member.id !== leader.id) // استبعاد قائد الحفلة
            .map(member => member.toString())
            .join('\n') || 'No members';

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Party Information')
            .addFields(
                { name: 'Party Leader', value: `${party.leader.toString()}`, inline: true },
                { name: 'Party Members', value: partyMembers, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'Party Bot' });

        return embed;
    }
}

module.exports = PartyManager;
