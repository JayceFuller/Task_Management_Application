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
        maximizable: false,
        fullscreenable: false, 
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
        return { success: true, data: lists };
    }
    catch (err) {
        console.log('Error in listDA.getLists(): ', err);
        return { success: false };
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
ipcMain.handle('deleteList', async (event, list) => {
    try {
        const rows = listDA.deleteList(list);
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

/**********************************************************************************************************
 * Task operations
 *********************************************************************************************************/
ipcMain.handle('getTodaysTasks', async () => {
    try {
        const data = taskDA.getTodaysTasks();
        return { success: true, data: data };
    }
    catch (err) {
        console.log('Error in taskDA.getTodaysTasks', err);
        return { success: false };
    }
});
ipcMain.handle('getOverdueTasks', async () => {
    try {
        const data = taskDA.getOverdueTasks();
        return { success: true, data: data };
    }
    catch (err) {
        console.log('Error in taskDA.getOverdueTasks', err);
        return { success: false };
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
ipcMain.handle('getTaskByList', async (event, list) => {
    try {
        const tasks = taskDA.getTaskByList(list);
        return { success: true, data: tasks };
    }
    catch (err) {
        console.log('Error in taskDA.getTaskByList(): ', err);
        return { success: false, data: [] };
    }
});
ipcMain.handle('completeTask', async (event, list) => {
    try {
        const rows = taskDA.completeTask(list);
        return { success: true };
    }
    catch (err) {
        console.log('Error in taskDA.completeTask(): ', err);
        return { success: false };
    }
});

/**********************************************************************************************************
 * Event operations
 *********************************************************************************************************/
ipcMain.handle('getTodaysEvents', () => {
    return new Promise((resolve, reject) => {
        eventDA.getTodaysEvents();
    });
})
ipcMain.handle('getSevenDayEvents', () => {
    return eventDA.getSevenDayEvents();
})
ipcMain.on('createEvent', (event, formData) => {
    eventDA.createEvent();
})
ipcMain.handle('deleteEvent', () => {
    return eventDA.deleteEvent();
})

/**********************************************************************************************************
 * Label operations
 *********************************************************************************************************/
ipcMain.handle('createLabel', () => {
    return labelDA.createLabel();
})
ipcMain.handle('deleteLabel', () => {
    return labelDA.deleteLabel();
})

/** Run application */
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (isMac) app.quit();
});