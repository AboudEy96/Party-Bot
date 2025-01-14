const { EmbedBuilder } = require('discord.js'); // تأكد من استيراد EmbedBuilder بشكل صحيح
const Party = require('./Party');

class PartyManager {
    constructor() {
        this.parties = new Map();
    }

    createParty(leader) {
        if (this.parties.has(leader.id)) {
            return "You already have a party";
        }

        const newParty = new Party(leader);
        this.parties.set(leader.id, newParty);
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

    // دالة لعرض الأعضاء في الـ Embed
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
