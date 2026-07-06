const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all tasks for today, as well as overdue tasks
 * 
 * @returns array of today's tasks, may be empty
 */
function getTodaysTasks() {
    const db = new Database(dbPath);
    const tasks = db.prepare(`SELECT * FROM Task WHERE date(DueDate) = CURRENT_DATE OR IsOverdue = 1`).all();
    db.close();
    return tasks;
}

/**
 * Get all tasks for the next 7 days
 */
function getSevenDayTasks() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            SELECT * FROM Task
            WHERE dueDate <= datetime('now', '+7 days') AND DueDate >= datetime('now')
        `).all();
    }
    catch (err) {
        console.log(`Error getting today's tasks`)
    }
    finally {
        db.close();
    }
}

/**
 * Create a new task and save it to the database
 * 
 * @param formData contains all the information to save a task to the database in the format
 * { name, details, due, recurrence, level, list }
 * @return the number of rows saved to the database
 */
function createTask(formData) {
    const db = new Database(dbPath);
    const { name, details, due, recurrence, level, list } = formData;
    const sql =  db.prepare(`
        INSERT INTO Task (
        TaskName, TaskDescription, DueDate, PriorityLevel, ListId, IsCompleted, IsOverdue, isRecurring
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const rows = sql.run(name, details, due, level, list, 0, 0, recurrence);
    db.close();
    return rows;
}

/**
 * Delete a task from the database
 */
function deleteTask() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            DELETE FROM Task
            WHERE TaskId = ?
        `);
    }
    catch (err) {
        console.log(`Error creating a new task`)
    }
    finally {
        db.close();
    }
}

function getTaskByList(list) {
    const db = new Database(dbPath);
    const tasks = db.prepare(`SELECT * FROM Task WHERE ListId = ?`).all(list.ListId);
    db.close();
    return tasks;
}

module.exports = {
    getTodaysTasks,
    getSevenDayTasks,
    createTask,
    deleteTask,
    getTaskByList
}