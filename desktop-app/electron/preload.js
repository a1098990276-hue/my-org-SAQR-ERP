const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('saqr', {
  version: '0.1.0'
});