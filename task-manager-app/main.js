const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const { join, dirname } = require("path");
const isMac = process.platform !== "darwin";
const { getWindowSettings, saveBounds } = require("./task-manager-api/user-settings");
const db = require('./data/database');
const taskDA = require('./task-manager-api/persistence/taskDA.js');
const eventDA = require('./task-manager-api/persistence/eventDA.js');
const labelDA = require('./task-manager-api/persistence/labelDA.js');

// Create the window of the app
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
        webPreferences: {
            preload: join(__dirname, "./preload.js"),
            contextIsolation: true
        }
    });

    window.loadFile("./task-manager-ui/home.html");
    window.on("resized", () => saveBounds(window.getSize()));
}

// Handle all task operations
ipcMain.handle('getTodaysTasks', () => {
    return taskDA.getTodaysTasks();
})
ipcMain.handle('getSevenDayTasks', () => {
    return taskDA.getSevenDayTasks();
})
ipcMain.handle('createTask', () => {
    return taskDA.createTask();
})
ipcMain.handle('deleteTask', () => {
    return taskDA.deleteTask();
})

// Handle all event operations
ipcMain.handle('getTodaysEvents', () => {
    return eventDA.getTodaysEvents();
})
ipcMain.handle('getSevenDayEvents', () => {
    return eventDA.getSevenDayEvents();
})
ipcMain.handle('createEvent', () => {
    return eventDA.createEvent();
})
ipcMain.handle('deleteEvent', () => {
    return eventDA.deleteEvent();
})

//Handle all label operations
ipcMain.handle('createLabel', () => {
    return labelDA.createLabel();
})
ipcMain.handle('deleteLabel', () => {
    return labelDA.deleteLabel();
})

// Run the app
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (isMac) app.quit();
});