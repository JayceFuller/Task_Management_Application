/** Model for Label table in the database */
class Label {
    constructor(label) {
        this.LabelId = label.LabelId;
        this.LabelName = label.LabelName;
    }

    convertToDBFormat() {
        return {
            LabelId: this.LabelId,
            LabelName: this.LabelName
        }
    }
}

module.exports = { Label };