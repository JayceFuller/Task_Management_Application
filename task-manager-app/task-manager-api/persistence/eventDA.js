const { Event } = require('../../task-manager-api/model/event.js'); 
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all events that include today in the date range
 * @return array of today's events, may be empty
 */
function getTodaysEvents() {
    const db = new Database(dbPath);
    const events = db.prepare(`SELECT * FROM Event WHERE date(StartDate) <= CURRENT_DATE AND date(EndDate) >= CURRENT_DATE`).all();
    db.close();
    return events.map(event => new Event(event));
}

/**
 * Get a single event by id
 * @param {int} eventId the id of the event to be found
 * @returns the event found in the database
 */
function getEventById(eventId) {
    const db = new Database(dbPath);
    const event = db.prepare(`SELECT * FROM Event WHERE EventId = ?`).get(eventId);
    db.close();
    return event;
}

/**
 * Create a new event and save it to the database
 * 
 * @param formData contains all the information to save a event to the database in the format
 * {name, details, location, start, end, recurrence group}
 * @return the number of rows saved to the database
 */
function createEvent(formData) {
    const db = new Database(dbPath);
    const { name, details, location, start, end, recurrence, label } = formData;
    const sql = db.prepare(`
        INSERT INTO Event (
            EventName, EventDesc, Location, StartDate, EndDate, Recurrence, LabelId
        ) VALUES(?, ?, ?, ?, ?, ?, ?)
    `);
    const rows = sql.run(name, details, location, start, end, recurrence, label);
    db.close();
    return rows;
}

/**
 * Delete an event from the database
 * 
 * @param {int} eventId the id of the event to be deleted
 * @return the number of rows saved
 */
function deleteEvent(eventId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`DELETE FROM Event WHERE EventId = ?`);
    const rows = sql.run(eventId);
    return rows;
}

/**
 * Gets all events corresponding to a given label
 * 
 * @param {Label} label the label to search by
 * @returns an array of all events matching the label, may be empty
 */
function getEventByLabel(label) {
    const db = new Database(dbPath);
    const events  = db.prepare(`SELECT * FROM Event WHERE LabelId = ? ORDER BY StartDate`).all(label.LabelId);
    db.close();
    return events.map(event => new Event(event));
}

/**
 * Updates the data stored for an event in the database
 * @param formData the new data to be saved to the event
 * @param {int} eventId the id of the event to be updated
 * @returns the number of rows saved
 */
function updateEvent(formData, eventId) {
    const db = new Database(dbPath);
    const { name, details, location, start, end, recurrence, label } = formData;
    const sql = db.prepare(`
        UPDATE Event SET
            EventName = ?,
            EventDesc = ?,
            Location = ?,
            StartDate = ?,
            EndDate = ?,
            LabelId = ?
        WHERE EventId = ?
    `);
    const rows = sql.run(name, details, location, start, end, label, eventId)
    db.close();
    return rows;
}

module.exports = {
    getTodaysEvents,
    getEventById,
    createEvent,
    deleteEvent,
    getEventByLabel,
    updateEvent
}