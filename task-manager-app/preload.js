const { contextBridge } = require("electron");

const API = {
    //add database gathering info here
}

contextBridge.exposeInMainWorld("api", API);