const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // ── Window Controls
  minimize:       () => ipcRenderer.send('win-minimize'),
  maximize:       () => ipcRenderer.send('win-maximize'),
  close:          () => ipcRenderer.send('win-close'),
  hide:           () => ipcRenderer.send('win-hide'),
  isMaximized:    () => ipcRenderer.invoke('win-is-maximized'),
  openParentPortal: () => ipcRenderer.send('open-parent-portal'),
  openMainSite:   () => ipcRenderer.send('open-main-site'),
  platform:       process.platform,

  // ── Auth
  getCurrentUser: () => ipcRenderer.invoke('get-current-user'),
  logout:         () => ipcRenderer.send('logout'),

  // ── Persistent Store
  store: {
    get:    (key)        => ipcRenderer.invoke('store-get', key),
    set:    (key, value) => ipcRenderer.send('store-set', key, value),
    getAll: ()           => ipcRenderer.invoke('store-get-all'),
    delete: (key)        => ipcRenderer.send('store-delete', key),
    clear:  ()           => ipcRenderer.send('store-clear'),
  },

  // ── Backup / Restore
  backup: {
    export: () => ipcRenderer.invoke('backup-export'),
    import: () => ipcRenderer.invoke('backup-import'),
    openFolder: () => ipcRenderer.send('open-backup-folder'),
  },

  // ── Parent Portal
  getPortalInfo: () => ipcRenderer.invoke('get-portal-info'),

  // ── User Management
  getUsers:  ()      => ipcRenderer.invoke('get-users'),
  saveUsers: (users) => ipcRenderer.send('save-users', users),

  // ── Auto Updates
  checkForUpdates: () => ipcRenderer.send('check-for-updates'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', (_, ver) => callback(ver)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', (_, ver) => callback(ver)),
});