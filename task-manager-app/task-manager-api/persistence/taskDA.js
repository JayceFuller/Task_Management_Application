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
    console.log(formData)
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
 * @param {Task} task the task to be deleted
 * @returns the number of rows saved
 */
function deleteTask(task) {
    const db = new Database(dbPath);
    const sql = db.prepare(`DELETE FROM Task WHERE TaskId = ?`);
    const rows = sql.run(task.TaskId);
    db.close();
    return rows;
}

/**
 * Gets all tasks corresponding to a given list
 * 
 * @param {List} list the list item to search by
 * @returns an array of all tasks matching the list, may be empty
 */
function getTasksByList(list) {
    const db = new Database(dbPath);
    const tasks = db.prepare(`SELECT * FROM Task WHERE ListId = ? AND IsCompleted = ? ORDER BY DueDate`).all(list.ListId, 0);
    db.close();
    return tasks.map(task => new Task(task));
}

/**
 * Gets all completed tasks corresponding to a given list
 * 
 * @param {List} list the list item to search by
 * @returns an array of all tasks matching the list, may be empty
 */
function getCompletedTasksByList(list) {
    const db = new Database(dbPath);
    const tasks = db.prepare(`SELECT * FROM Task WHERE ListId = ? AND IsCompleted = ? ORDER BY DueDate`).all(list.ListId, 1);
    db.close();
    return tasks.map(task => new Task(task));
}

/**
 * Get a single task by a given id
 * 
 * @param {int} taskId the id of the task to be fetched
 * @returns the task found
 */
function getTaskById(taskId) {
    const db = new Database(dbPath);
    const task = db.prepare(`SELECT * FROM Task WHERE TaskId = ?`).get(taskId);
    db.close();
    return new Task(task);
}

/**
 * Changes the status of a task to completed
 * 
 * @param {int} id the id of task item being completed
 * @returns the number of rows modified
 */
function completeTask(id) {
    const db = new Database(dbPath);
    const sql = db.prepare(`UPDATE Task SET IsCompleted = 1 WHERE TaskId = ?`);
    const rows = sql.run(id)
    db.close();
    return rows;
}

/**
 * Changes the status of a task to not completed
 * 
 * @param {int} id the id of the task item
 * @returns the number of rows modified
 */
function uncompleteTask(id) {
    const db = new Database(dbPath);
    const sql = db.prepare(`UPDATE Task SET IsCompleted = 0 WHERE TaskId = ?`);
    const rows = sql.run(id)
    db.close();
    return rows;
}


/**
 * Delete all completed tasks from a given list
 * 
 * @param {List} list the list from which to delete tasks
 * @returns the number of rows deleted
 */
function deleteCompleted(list) {
    const db = new Database(dbPath);
    const sql = db.prepare(`DELETE FROM Task WHERE IsCompleted = 1 and ListId = ?`);
    const rows = sql.run(list.ListId);
    return rows;
}

function updateTask(formData, taskId) {
    const db = new Database(dbPath);
    const { name, details, due, recurrence, level, list } = formData;
    const sql = db.prepare(`
        UPDATE Task SET
            TaskName = ?,
            TaskDesc = ?,
            DueDate = ?,
            PriorityLevel = ?,
            ListId = ?
        WHERE TaskId = ?
    `);
    const rows = sql.run(name, details, due, level, list, taskId);
    db.close();
    return rows;
}

module.exports = {
    getTodaysTasks,
    getOverdueTasks,
    createTask,
    deleteTask,
    getTasksByList,
    getCompletedTasksByList,
    completeTask,
    uncompleteTask,
    getTaskById,
    deleteCompleted,
    updateTask
}