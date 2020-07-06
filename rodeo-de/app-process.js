const { BrowserWindow } = require("electron");
const url = require('url');
const path = require('path');
// function createAppWindow() {
//   let win = new BrowserWindow({
//     width: 1000,
//     height: 600,
//     webPreferences: {
//       nodeIntegration: true,
//       enableRemoteModule: true,
//     },
//   });

//   win.loadFile("./renderers/home.html");

//   win.on("closed", () => {
//     win = null;
//   });
// }
function createAppWindow() {
    let mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
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