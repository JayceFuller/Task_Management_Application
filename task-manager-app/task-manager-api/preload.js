const { contextBridge, ipcRenderer } = require("electron");

/** Bridge all API calls from frontend to backend */
const electronAPI = {
    /** Task operations */
    getTodaysTasks: () => ipcRenderer.invoke('getTodaysTasks'),
    getOverdueTasks: () => ipcRenderer.invoke('getOverdueTasks'),
    getTodaysEvents: () => ipcRenderer.invoke('getTodaysEvents'),
    createTask: (formData) => ipcRenderer.invoke('createTask', formData),
    getTaskByList: (list) => ipcRenderer.invoke('getTaskByList', list),
    completeTask: (list) => ipcRenderer.invoke('completeTask', list),

    /** List operations */
    getLists: () => ipcRenderer.invoke('getLists'),
    createList: (formData) => ipcRenderer.invoke('createList', formData)
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI);