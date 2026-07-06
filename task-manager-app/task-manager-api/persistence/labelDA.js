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
    return labels;
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
            LabelName, Color
        ) VALUES(?, ?, ?)
    `);
    const rows = sql.run(name, 0);
    db.close();
    return rows;
}

/**
 * Delete a label from the database
 */
function deleteLabel() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            DELETE FROM Label
            WHERE LabelId = ?
        `);
    }
    catch (err) {
        console.log(`Error saving new label to the database`)
    }
    finally {
        db.close();
    }
}

module.exports = {
    getLabels,
    createLabel,
    deleteLabel
}