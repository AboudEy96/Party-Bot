class Party {
    constructor(leader)
    {
        this.leader = leader;
        this.members = [leader];
    }
    addMember(user){
        if (this.members.includes(user)) {
            return false;
        }
        this.members.push(user);
        return `${user.username} has been added to the Party`
    }
    removeMember(user){
        if (!this.members.includes(user)){
            return false;
        }
        const userIndex = this.members.indexOf(user);
        this.members.splice(userIndex, 1);
        return `${user.username} has been removed from the Party`
    }
    showParty() {
        return this.members.map((user) => user.toString()).join(" , ");
    }
}
module.exports = Party;
