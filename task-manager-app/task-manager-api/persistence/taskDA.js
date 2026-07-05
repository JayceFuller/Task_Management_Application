const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all tasks for today, as well as overdue tasks
 */
function getTodaysTasks() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            SELECT * FROM Task
            WHERE dueDate = datetime('now') OR isOverdue = 1
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
 * Get all tasks for the next 7 days
 */
function getSevenDayTasks() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            SELECT * FROM Task
            WHERE dueDate <= datetime('now', '+7 days') AND dueDate >= datetime('now')
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
 * {name, details, due, level, group}
 * @return the number of rows saved to the database
 */
function createTask(formData) {
    const db = new Database(dbPath);
    const { name, details, due, level, group } = formData;
    try {
        const sql =  db.prepare(`
            INSERT INTO Task (
            TaskId, TaskName, TaskDescription, DueDate, IsCompleted, IsOverdue, PriorityLevel, LabelId
           ) VALUES (?, ?, ?, 0, 0, ?, ?)
        `);
        const rows = sql.run(name, details, due, level, group);
        return rows;
    }
    catch (err) {
        console.log(`Error creating a new task:`, err.message);
    }
    finally {
        db.close();
    }
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

module.exports = {
    getTodaysTasks,
    getSevenDayTasks,
    createTask,
    deleteTask
}