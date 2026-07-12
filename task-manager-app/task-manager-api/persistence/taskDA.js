const { Task } = require('../../task-manager-api/model/task.js'); 
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all tasks for today, regardless of completion status
 * 
 * @returns array of today's tasks, may be empty
 */
function getTodaysTasks() {
    const db = new Database(dbPath);
    const tasks = db.prepare(`SELECT * FROM Task WHERE date(DueDate) = CURRENT_DATE`).all();
    db.close();
    return tasks.map(task => new Task(task));
}

/**
 * Gets all incomplete tasks from previous dates
 * 
 * @returns array of overdue tasks, may be empty
 */
function getOverdueTasks() {
    const db = new Database(dbPath);
    const tasks = db.prepare(`SELECT * FROM Task WHERE date(DueDate) < CURRENT_DATE AND IsCompleted = 0`).all();
    db.close();
    return tasks.map(task => new Task(task));
}

/**
 * Create a new task and save it to the database
 * 
 * @param formData contains all the information to save a task to the database in the format
 * { name, details, due, recurrence, level, list }
 * @returns the number of rows saved to the database
 */
function createTask(formData) {
    const db = new Database(dbPath);
    const { name, details, due, recurrence, level, list } = formData;
    const sql =  db.prepare(`
        INSERT INTO Task (
            TaskName, TaskDesc, DueDate, Recurrence, PriorityLevel, ListId, IsCompleted
        ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const rows = sql.run(name, details, due, recurrence, level, list, 0);
    db.close();
    return rows;
}

/**
 * Delete a task from the database
 * 
 * @param task the task to be deleted
 * @returns the number of rows saved
 */
function deleteTask(task) {
    const db = new Database(dbPath);
    const sql = db.prepare(`DELETE FROM Task WHERE TaskId = ?`);
    const rows = sql.run(task.TaskId);
    return rows;
}

/**
 * Gets all tasks corresponding to a given list
 * 
 * @param list the list item to search by
 * @returns an array of all tasks matching the list, may be empty
 */
function getTaskByList(list) {
    const db = new Database(dbPath);
    const tasks = db.prepare(`SELECT * FROM Task WHERE ListId = ? ORDER BY DueDate`).all(list.ListId);
    db.close();
    return tasks.map(task => new Task(task));
}

/**
 * Changes the status of a task to completed
 * 
 * @param task the task item being completed
 * @returns the number of rows modified
 */
function completeTask(task) {
    const db = new Database(dbPath);
    const sql = db.prepare(`UPDATE Task SET IsCompleted = 1 WHERE TaskId = ?`);
    const rows = sql.run(task.TaskId)
    db.close();
    return rows;
}

module.exports = {
    getTodaysTasks,
    getOverdueTasks,
    createTask,
    deleteTask,
    getTaskByList,
    completeTask
}