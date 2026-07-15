const { contextBridge, ipcRenderer } = require("electron");

/** Bridge all API calls from frontend to backend */
const electronAPI = {
    quitApp: () => ipcRenderer.invoke("quitApp"),
    
    /** Task operations */
    getTodaysTasks: () => ipcRenderer.invoke('getTodaysTasks'),
    getOverdueTasks: () => ipcRenderer.invoke('getOverdueTasks'),
    getTodaysEvents: () => ipcRenderer.invoke('getTodaysEvents'),
    createTask: (formData) => ipcRenderer.invoke('createTask', formData),
    getTasksByList: (list) => ipcRenderer.invoke('getTasksByList', list),
    getCompletedTasksByList: (list) => ipcRenderer.invoke('getCompletedTasksByList', list),
    completeTask: (list) => ipcRenderer.invoke('completeTask', list),
    getTaskById: (taskId) => ipcRenderer.invoke('getTaskById', taskId),

    /** List operations */
    getLists: () => ipcRenderer.invoke('getLists'),
    createList: (formData) => ipcRenderer.invoke('createList', formData),

    /** Label operations */
    getLabels: () => ipcRenderer.invoke('getLabels'),
    createLabel: (formData) => ipcRenderer.invoke('createLabel', formData),

    /** Event operations */
    createEvent: (formData) => ipcRenderer.invoke('createEvent', formData),
    getEventByLabel: (label) => ipcRenderer.invoke('getEventByLabel', label)
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI);