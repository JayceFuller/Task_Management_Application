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
        icon: join(__dirname, "./assets/AppIcon.ico"),
        webPreferences: {
            preload: join(__dirname, "./preload.js"),
            contextIsolation: true
        }
    });

    // window.webContents.openDevTools();
    window.loadFile("./task-manager-ui/home.html");
    window.on("resized", () => saveBounds(window.getSize()));
}

// Handle all label operations
ipcMain.handle('getLabels', () => {
    return labelDA.getLabels();
})

// Handle all task operations
ipcMain.handle('getTodaysTasks', () => {
    return taskDA.getTodaysTasks();
})
ipcMain.handle('getSevenDayTasks', () => {
    return taskDA.getSevenDayTasks();
})
ipcMain.on('createTask', (event, formData) => {
    taskDA.createTask(formData);
})
ipcMain.handle('deleteTask', () => {
    return taskDA.deleteTask();
})
ipcMain.handle('getTaskByList', (event, label) => {
    return new Promise((resolve, reject) => {
        taskDA.getTaskByList(label);
    });
})

// Handle all event operations
ipcMain.handle('getTodaysEvents', () => {
    return eventDA.getTodaysEvents();
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