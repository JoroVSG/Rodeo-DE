const { BrowserWindow } = require("electron");
const url = require('url');
const path = require('path');

function createAppWindow() {
    let mainWindow = new BrowserWindow({
      width: 1440,
      height: 980,
      webPreferences: {
        nodeIntegration: true,
      },
    });
  
    if (process.env.NODE_ENV === 'development') {
      mainWindow.loadURL(`http://localhost:4000`);
    } else {
      mainWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, '../index.html'),
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