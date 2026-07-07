/** Model for the List table in the database */
class List {
    constructor(list) {
        this.ListId = list.ListId;
        this.ListName = list.ListName;
    }

    convertToDBFormat() {
        return {
            ListId: this.ListId,
            ListName: this.ListName
        };
    }
}

module.exports = { List };