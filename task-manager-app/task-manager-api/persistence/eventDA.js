const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all events that include today in the date range
 */
function getTodaysEvents() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            SELECT * FROM Event
            WHERE startDate <= datetime('now') AND endDate >= datetime('now')
        `).all();
    }
    catch (err) {
        console.log(`Error getting today's events`)
    }
    finally {
        db.close();
    }
}

/**
 * Get all events for the next 7 days
 */
function getSevenDayEvents() {
    const db = new Database(dbPath);
    try {
        return db.prepare( `
            SELECT * FROM Event
            WHERE startDate <= datetime('now', '+7 days') AND endDate >= datetime('now', '+7 days')
        `).all();
    }
    catch (err) {
        console.log(`Error getting today's events`)
    }
    finally {
        db.close();
    }
}

/**
 * Create a new event and save it to the database
 * 
 * @param formData contains all the information to save a task to the database in the format
 * {name, details, location, start, end, recurrence group}
 * @return the number of rows saved to the database
 */
function createEvent(formData) {
    const db = new Database(dbPath);
    const { name, details, location, start, end, recurrence, group } = formData;
    try {
        const sql = db.prepare(`
            INSERT INTO Event (
                EventId, EventTitle, Description, Location, StartDate, EndDate, IsRecurring, LabelId
            ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const rows = sql.run(name, details, location, start, end, recurrence, group);
        return rows;
    }
    catch (err) {
        console.log(`Error getting today's events`)
    }
    finally {
        db.close();
    }
}

/**
 * Delete an event from the database
 */
function deleteEvent() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            DELETE FROM Event
            WHERE EventId = ?
        `);
    }
    catch (err) {
        console.log(`Error getting today's events`)
    }
    finally {
        db.close();
    }
}

module.exports = {
    getTodaysEvents,
    getSevenDayEvents,
    createEvent,
    deleteEvent
}