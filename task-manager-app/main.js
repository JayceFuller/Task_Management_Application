const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { join, dirname } = require("path");
const isMac = process.platform !== "darwin";
const { getWindowSettings, saveBounds } = require("./task-manager-api/user-settings");
const taskDA = require('./task-manager-api/persistence/taskDA.js');
const listDA = require('./task-manager-api/persistence/listDA.js');
const eventDA = require('./task-manager-api/persistence/eventDA.js');
const labelDA = require('./task-manager-api/persistence/labelDA.js');

/**
 * Create the application window
 */
function createWindow() {
    const bounds = getWindowSettings();
    Menu.setApplicationMenu(null);
    
    const window = new BrowserWindow({
        width: bounds[0],
        height: bounds[1],
        resizable: true,
        maximizable: true,
        fullscreenable: true, 
        transparent: false,
        icon: join(__dirname, "./assets/AppIcon.ico"),
        webPreferences: {
            preload: join(__dirname, "./task-manager-api/preload.js"),
            contextIsolation: true,
            nodeIntegration: false
        }
    });

    window.webContents.openDevTools();
    window.loadFile("./task-manager-ui/home.html");
    window.on("resized", () => saveBounds(window.getSize()));
}

/**********************************************************************************************************
 * List operations
 *********************************************************************************************************/
ipcMain.handle('getLists', () => {
    try {
        const lists = listDA.getLists();
        return lists;
    }
    catch (err) {
        console.log('Error in listDA.getLists(): ', err);
        return [];
    }
});
ipcMain.handle('getListById', (event, listId) => {
    try {
        const list = listDA.getListById(listId);
        return list;
    }
    catch (err) {
        console.log('Error in listDA.getListById(): ', err);
        return null;
    }
});
ipcMain.handle('createList', async (event, formData) => {
    try {
        const rows = listDA.createList(formData);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in listDA.createList(): ', err);
        return { success: false };
    }
});
ipcMain.handle('deleteList', async (event, listId) => {
    try {
        const rows = listDA.deleteList(listId);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in listDA.deleteList(): ', err);
        return { success: false };
    }
});
ipcMain.handle('renameList', async (event, listName, listId) => {
    try {
        const rows = listDA.renameList(listName, listId);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in listDA.renameList(): ', err);
        return { success: false };
    }
});

/**********************************************************************************************************
 * Task operations
 *********************************************************************************************************/
ipcMain.handle('getTodaysTasks', async () => {
    try {
        const data = taskDA.getTodaysTasks();
        return data;
    }
    catch (err) {
        console.log('Error in taskDA.getTodaysTasks', err);
        return [];
    }
});
ipcMain.handle('getOverdueTasks', async () => {
    try {
        const data = taskDA.getOverdueTasks();
        return data;
    }
    catch (err) {
        console.log('Error in taskDA.getOverdueTasks', err);
        return [];
    }
});
ipcMain.handle('getTaskById', async (event, taskId) => {
    try {
        const task = taskDA.getTaskById(taskId);
        return task;
    }
    catch (err) {
        console.log('Error in taskDA.getTaskById(): ', err);
        return [];
    }
});
ipcMain.handle('createTask', async (event, formData) => {
    try {
        const rows = taskDA.createTask(formData);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in taskDA.createTask(): ', err);
        return { success: false };
    }
});
ipcMain.handle('deleteTask', async (event, task) => {
    try {
        const rows = taskDA.deleteTask(task);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in taskDA.deleteTask(): ', err);
        return { success: false };
    }
});
ipcMain.handle('deleteCompleted', async (event, list) => {
    try {
        const rows = taskDA.deleteCompleted(list);
        if (rows >= 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in taskDA.deleteCompleted(): ', err);
        return { success: false };
    }
});
ipcMain.handle('getTasksByList', async (event, list) => {
    try {
        const tasks = taskDA.getTasksByList(list);
        return tasks;
    }
    catch (err) {
        console.log('Error in taskDA.getTasksByList(): ', err);
        return [];
    }
});
ipcMain.handle('getCompletedTasksByList', async (event, list) => {
    try {
        const tasks = taskDA.getCompletedTasksByList(list);
        return tasks;
    }
    catch (err) {
        console.log('Error in taskDA.getCompletedTasksByList(): ', err);
        return [];
    }
});
ipcMain.handle('completeTask', async (event, task) => {
    try {
        const rows = taskDA.completeTask(task);
        return { success: true };
    }
    catch (err) {
        console.log('Error in taskDA.completeTask(): ', err);
        return { success: false };
    }
});
ipcMain.handle('uncompleteTask', async (event, task) => {
    try {
        const rows = taskDA.uncompleteTask(task);
        return { success: true };
    }
    catch (err) {
        console.log('Error in taskDA.uncompleteTask(): ', err);
        return { success: false };
    }
});
ipcMain.handle('updateTask', async (event, formData, taskId) => {
    try {
        const rows = taskDA.updateTask(formData, taskId);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in taskDA.updateTask(): ', err);
        return { success: false };
    }
});

/**********************************************************************************************************
 * Event operations
 *********************************************************************************************************/
ipcMain.handle('getTodaysEvents', () => {
    try {
        const data = eventDA.getTodaysEvents();
        return { success: true, data: data };
    }
    catch (err) {
        console.log('Error in eventDA.getTodaysEvents(): ', err);
        return { success: false };
    }
});
ipcMain.handle('createEvent', async (event, formData) => {
    try {
        const rows = eventDA.createEvent(formData);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in eventDA.createEvent(): ', err);
        return { success: false };
    }
});
ipcMain.handle('deleteEvent', () => {
    return eventDA.deleteEvent();
})
ipcMain.handle('getEventByLabel', async (event, label) => {
    try {
        const events = eventDA.getEventByLabel(label);
        return { success: true, data: events };
    }
    catch (err) {
        console.log('Error in eventDA.getEventByLabel(): ', err);
        return { success: false, data: [] };
    }
});

/**********************************************************************************************************
 * Label operations
 *********************************************************************************************************/
ipcMain.handle('getLabels', () => {
    try {
        const labels = labelDA.getLabels();
        return { success: true, data: labels };
    }
    catch (err) {
        console.log('Error in labelDA.getLabels(): ', err);
        return { success: false };
    }
});
ipcMain.handle('createLabel', (event, formData) => {
    try {
        const rows = labelDA.createLabel(formData);
        if (rows > 0) {
            return { success: true };
        }
        return { success: false };
    }
    catch (err) {
        console.log('Error in labelDA.createLabel(): ', err);
        return { success: false };
    }
})
ipcMain.handle('deleteLabel', () => {
    return labelDA.deleteLabel();
})

/** Run application */
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (isMac) app.quit();
});
ipcMain.handle('quitApp', () => {
    app.quit();
})