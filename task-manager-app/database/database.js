const { join, dirname } = require("path");
const Database = require('better-sqlite3');

//Create the database connection
let db;
try {
    const db = new Database(join(__dirname, "database.db"));
    console.log("Database connected");
}
catch (err) {
    console.log("Database connection failed", err);
}

module.exports = db;

// //Get tasks for current date
// const todayTasks = db.prepare(`
//     SELECT * FROM Task
//     WHERE dueDate = datetime('now')
// `).all();

// //Get all tasks for the next 7 days
// const weekTasks = db.prepare(`
//     SELECT * FROM Task
//     WHERE dueDate <= datetime('now', '+7 days') and dueDate >= datetime('now')
// `);

// //Get events for current date
// const todayEvents = db.prepare(`
//     SELECT * FROM Event
//     WHERE startDate = datetime('now')
// `)

// //Get all events for the next seven days
// const weekEvents = db.prepare( `
//     SELECT * FROM Event
//     WHERE startDate <= datetime('now', '+7 days') and startDate >= datetime('now')
// `);

// //Create a new task
// const createTask = db.prepare(`
//     INSERT INTO Task (
//         TaskId, TaskName, TaskDescription, DueDate, IsCompleted, IsOverdue, PriorityLevel, LabelId
//     ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
// `);

// //Create a new event
// const createEvent = db.prepare(`
//     INSERT INTO Event (
//         EventId, EventTitle, Description, Location, StartDate, EndDate, IsRecurring, LabelId
//     ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
// `);

// //Create a new label
// const createLabel = db.prepare(`
//     INSERT INTO Label(
//         LabelId, LabelName, Color
//     ) VALUES(?, ?, ?)
// `);

// //Delete a task
// const removeTask = db.prepare(`
//     DELETE FROM Task
//     WHERE TaskId = ?
// `);

// //Delete an event
// const removeEvent = db.prepare(`
//     DELETE FROM Event
//     WHERE EventId = ?
// `);

// //Delete a task
// const removeTask = db.prepare(`
//     DELETE FROM Task
//     WHERE TaskId = ?
// `);

// //Delete a label
// const removeLabel = db.prepare(`
//     DELETE FROM Label
//     WHERE LabelId = ?
// `);