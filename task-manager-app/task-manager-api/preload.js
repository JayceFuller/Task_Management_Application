const { contextBridge, ipcRenderer } = require("electron");

const electronAPI = {
    getTodaysTasks: () => ipcRenderer.invoke('getTodaysTasks'),
    getTodaysEvents: () => ipcRenderer.invoke('getTodaysEvents'),
    createTask: (formData) => ipcRenderer.invoke('createTask', formData),
    createEvent: (formData) => ipcRenderer.send('createEvent', formData),
    getTaskByList: (label) => ipcRenderer.send('getTaskByList', label),
    getLabels: () => ipcRenderer.invoke('getLabels')
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI);