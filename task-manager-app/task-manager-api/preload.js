const { contextBridge, ipcRenderer } = require("electron");

const API = {
    getTodaysTasks: () => ipcRenderer.invoke('getTodaysTasks')
}

contextBridge.exposeInMainWorld("api", API);