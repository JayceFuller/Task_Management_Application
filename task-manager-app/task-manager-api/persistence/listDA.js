const { List } = require('../../task-manager-api/model/list.js');
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all lists from the database
 * 
 * @return array of lists, may be empty
 */
function getLists() {
    const db = new Database(dbPath);
    const lists = db.prepare(`SELECT * FROM List`).all();
    db.close();
    return lists.map(list => new List(list));
}

/**
 * Get a single list by id
 * 
 * @param {int} listId id of the list to be found
 * @returns the List object found
 */
function getListById(listId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`SELECT * FROM List WHERE ListId = ?`);
    const list = sql.get(listId);
    db.close();
    return list;
}

/**
 * Create a new list and save it to the database
 * 
 * @param formData contains all the information to save a list to the database in the format
 * { name }
 * @return the number of rows saved to the database
 */
function createList(formData) {
    const db = new Database(dbPath);
    const { name } = formData;
    const sql = db.prepare(`
        INSERT INTO List(
            ListName
        ) VALUES(?)
    `);
    const rows = sql.run(name);
    db.close();
    return rows;
}

/**
 * Delete a list from the database
 * 
 * @param {int} listId the id of the list to be deleted
 * @returns the number of rows saved
 */
function deleteList(listId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`DELETE FROM List WHERE ListId = ?`);
    const rows = sql.run(listId);
    db.close();
    return rows;
}

/**
 * Renames a given list title
 * 
 * @param {string} listName the new name to replace the original list name
 * @param {int} listId the id of the list to be updated
 * @returns the number of rows modified
 */
function renameList(listName, listId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`UPDATE List SET ListName = ? WHERE ListId = ?`);
    const rows = sql.run(listName, listId);
    db.close();
    return rows;
}

module.exports = {
    getLists,
    getListById,
    createList,
    deleteList,
    renameList
}