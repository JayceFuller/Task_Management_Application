const { contextBridge, ipcRenderer } = require("electron");

const API = {
    getTodaysTasks: () => ipcRenderer.invoke('getTodaysTasks'),
    createTask: (formData) => ipcRenderer.send('createTask', formData),
    createEvent: (formData) => ipcRenderer.send('createEvent', formData),
}

contextBridge.exposeInMainWorld("api", API);