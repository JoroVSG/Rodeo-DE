const { BrowserWindow } = require("electron");
const url = require('url');
const path = require('path');
const isDev = require("electron-is-dev");

function createAppWindow() {
    let mainWindow = new BrowserWindow({
      width: 1440,
      height: 980,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });
  
    if (isDev) {
      mainWindow.loadURL('http://localhost:3000');
    } else {
      mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, "../build/index.html"),
            protocol: 'file:',
            slashes: true
        })
      );
    }
    
    mainWindow.on('closed', () => {
      mainWindow = null;
    });
  }

module.exports = createAppWindow;