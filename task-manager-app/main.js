const { app, BrowserWindow, Menu } = require("electron");
const { join, dirname } = require("path");
const { getWindowSettings, saveBounds } = require("./task-manager-api/user-settings");
const db = require('./data/database');

const isMac = process.platform !== "darwin";

// Create the window of the app
function createWindow() {
    const bounds = getWindowSettings();
    const mainMenu = Menu.buildFromTemplate(menu);
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

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (isMac) app.quit();
});

//Create menu template
const menu = [
    {
        label: 'File',
        submenu: [
            { role: 'quit' }
        ]
    },
];