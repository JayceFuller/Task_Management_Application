/** Model for the Event table in the database */
class Event {
    constructor(event) {
        this.EventId = event.EventId;
        this.EventName = event.EventName;
        this.EventDesc = event.EventDesc;
        this.Location = event.Location;
        this.StartDate = event.StartDate;
        this.EndDate = event.EndDate;
        this.Recurrence = event.Recurrence;
        this.LabelId = event.LabelId;

    }

    convertToDBFormat() {
        return {
            EventId: this.EventId,
            EventName: this.EventName,
            EventDesc: this.EventDesc,
            StartDate: this.StartDate,
            Location: this.Location,
            Recurrence: this.Recurrence,
            EndDate: this.EndDate,
            LabelId: this.LabelId
        };
    }
}

module.exports = { Event };