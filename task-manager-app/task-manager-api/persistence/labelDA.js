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
 */
function createLabel() {
    const db = new Database(dbPath);
    try {
        return db.prepare(`
            INSERT INTO Label(
                LabelId, LabelName, Color
            ) VALUES(?, ?, ?)
        `);
    }
    catch (err) {
        console.log(`Error saving new label to the database`)
    }
    finally {
        db.close();
    }
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