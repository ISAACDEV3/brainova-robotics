const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('loginAPI', {
  login:   (username, password) => ipcRenderer.invoke('login-attempt', { username, password }),
  proceed: ()                   => ipcRenderer.send('login-success'),
  platform: process.platform,
});
