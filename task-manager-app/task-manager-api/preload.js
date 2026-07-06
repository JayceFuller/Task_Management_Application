const { contextBridge, ipcRenderer } = require("electron");

/** Bridge all API calls from frontend to backend */
const electronAPI = {
    getTodaysTasks: () => ipcRenderer.invoke('getTodaysTasks'),
    getTodaysEvents: () => ipcRenderer.invoke('getTodaysEvents'),
    createTask: (formData) => ipcRenderer.invoke('createTask', formData),
    createEvent: (formData) => ipcRenderer.invoke('createEvent', formData),
    getTaskByList: (list) => ipcRenderer.invoke('getTaskByList', list),
    getLists: () => ipcRenderer.invoke('getLists'),
    createList: (formData) => ipcRenderer.invoke('createList', formData)
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI);