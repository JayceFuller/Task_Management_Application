const { contextBridge, ipcRenderer } = require("electron");
const { getTaskByList } = require("./persistence/taskDA");

const API = {
    getTodaysTasks: () => ipcRenderer.invoke('getTodaysTasks'),
    createTask: (formData) => ipcRenderer.send('createTask', formData),
    createEvent: (formData) => ipcRenderer.send('createEvent', formData),
    getTaskByList: (label) => ipcRenderer.send('getTaskByList', label),
    getLabels: () => ipcRenderer.invoke('getLabels')
}

contextBridge.exposeInMainWorld("api", API);