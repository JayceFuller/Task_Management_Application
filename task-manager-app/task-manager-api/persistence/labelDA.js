const { Label } = require('../../task-manager-api/model/label.js');
const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '../../data/database.db');

/**
 * Get all labels from the database
 * 
 * @return array of labels, may be empty
 */
function getLabels() {
    const db = new Database(dbPath);
    const labels = db.prepare(`SELECT * FROM Label`).all();
    db.close();
    return labels.map(label => new Label(label));
}

/**
 * Get a label by id
 * @param {int} labelId the id of the label to be found
 * @returns the label found
 */
function getLabelById(labelId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`SELECT * FROM Label WHERE LabelId = ?`);
    const label = sql.get(labelId);
    db.close();
    return label;
}

/**
 * Create a new label and save it to the database
 * 
 * @param formData contains all the information to save a label to the database in the format
 * { name }
 * @return the number of rows saved to the database
 */
function createLabel(formData) {
    const db = new Database(dbPath);
    const { name } = formData;
    const sql = db.prepare(`
        INSERT INTO Label(
            LabelName
        ) VALUES(?)
    `);
    const rows = sql.run(name);
    db.close();
    return rows;
}

/**
 * Delete a label from the database
 * @param {int} labelId the id of the label to be deleted
 * @returns the number of rows saved
 */
function deleteLabel(labelId) {
    const db = new Database(dbPath);
    const sql = db.prepare(`DELETE FROM Label WHERE LabelId = ?`);
    const rows = sql.run(labelId);
    db.close();
    return rows;
}

module.exports = {
    getLabels,
    getLabelById,
    createLabel,
    deleteLabel
}