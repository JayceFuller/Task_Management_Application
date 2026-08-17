const { Calendar } = require('../model/calendar.js');
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all Calendars from the database
 * 
 * @return array of Calendars, may be empty
 */
function getCalendars() {
    const db = new Database(dbPath);
    const calendars = db.prepare(`SELECT * FROM Calendar`).all();
    db.close();
    return calendars.map(calendar => new Calendar(calendar));
}

/**
 * Get a Calendar by id
 * @param {int} calendarId the id of the Calendar to be found
 * @returns the Calendar found
 */
function getCalendarById(calendarId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`SELECT * FROM Calendar WHERE CalendarId = ?`);
    const calendar = sql.get(calendarId);
    db.close();
    return calendar;
}

/**
 * Create a new Calendar and save it to the database
 * 
 * @param formData contains all the information to save a Calendar to the database in the format
 * { name }
 * @return the number of rows saved to the database
 */
function createCalendar(formData) {
    const db = new Database(dbPath);
    const { name } = formData;
    const sql = db.prepare(`
        INSERT INTO Calendar(
            CalendarName
        ) VALUES(?)
    `);
    const rows = sql.run(name);
    db.close();
    return rows;
}

/**
 * Delete a Calendar from the database
 * @param {int} calendarId the id of the Calendar to be deleted
 * @returns the number of rows saved
 */
function deleteCalendar(calendarId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`DELETE FROM Calendar WHERE CalendarId = ?`);
    const rows = sql.run(calendarId);
    db.close();
    return rows;
}

/**
 * Renames a given calendar title
 * 
 * @param {string} calendarName the new name to replace the original calendar name
 * @param {int} calendarId the id of the calendar to be updated
 * @returns the number of rows modified
 */
function renameCalendar(calendarName, calendarId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`UPDATE Calendar SET CalendarName = ? WHERE CalendarId = ?`);
    const rows = sql.run(calendarName, calendarId);
    db.close();
    return rows;
}

module.exports = {
    getCalendars,
    getCalendarById,
    createCalendar,
    deleteCalendar,
    renameCalendar  
}