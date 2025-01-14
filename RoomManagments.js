class RoomManagments {
    constructor(guild, category){
        this.category = category;
        this.guild = guild;
    }



    static async createCategory(guild, name) {
        if (!guild) return;
        const category = await guild.channels.create({
            name,
            type: 4,
        });

        return new RoomManagments(guild, category);
    }
    async addTextChannel(name) {
        if (!this.category) return;

        const channel = await this.guild.channels.create({
            name,
            type: 0,
            parent: this.category.id,

        });

        return channel;
    }
    async addVoiceChannel(name) {
        if (!this.category) return;

        const Vchannel = await this.guild.channels.create({
            name,
            type: 2,
            parent: this.category.id,
        });
        return Vchannel;
    }
}
module.exports = RoomManagments;
