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
    completeTask: (task) => ipcRenderer.invoke('completeTask', task),
    uncompleteTask: (task) => ipcRenderer.invoke('uncompleteTask', task),
    getTaskById: (taskId) => ipcRenderer.invoke('getTaskById', taskId),
    deleteTask: (taskId) => ipcRenderer.invoke('deleteTask', taskId),
    deleteCompleted: (list) => ipcRenderer.invoke('deleteCompleted', list),
    updateTask: (formData, taskId) => ipcRenderer.invoke('updateTask', formData, taskId),

    /** List operations */
    getLists: () => ipcRenderer.invoke('getLists'),
    getListById: (listId) => ipcRenderer.invoke('getListById', listId),
    createList: (formData) => ipcRenderer.invoke('createList', formData),
    deleteList: (listId) => ipcRenderer.invoke('deleteList', listId),
    renameList: (listName, listId) => ipcRenderer.invoke('renameList', listName, listId),

    /** Label operations */
    getLabels: () => ipcRenderer.invoke('getLabels'),
    getLabelById: (labelId) => ipcRenderer.invoke('getLabelById', labelId),
    createLabel: (formData) => ipcRenderer.invoke('createLabel', formData),
    deleteLabel: (labelId) => ipcRenderer.invoke('deleteLabel', labelId),

    /** Event operations */
    getTodaysEvents: () => ipcRenderer.invoke('getTodaysEvents'),
    getEventById: (eventId) => ipcRenderer.invoke('getEventById', eventId),
    createEvent: (formData) => ipcRenderer.invoke('createEvent', formData),
    getEventByLabel: (label) => ipcRenderer.invoke('getEventByLabel', label),
    deleteEvent: (eventId) => ipcRenderer.invoke('deleteEvent', eventId),
    updateEvent: (formData, eventId) => ipcRenderer.invoke('updateEvent', formData, eventId)
}

contextBridge.exposeInMainWorld("electronAPI", electronAPI);