/** Model for Calendar table in the database */
class Calendar {
    constructor(Calendar) {
        this.CalendarId = Calendar.CalendarId;
        this.CalendarName = Calendar.CalendarName;
    }

    convertToDBFormat() {
        return {
            CalendarId: this.CalendarId,
            CalendarName: this.CalendarName
        }
    }
}

module.exports = { Calendar };