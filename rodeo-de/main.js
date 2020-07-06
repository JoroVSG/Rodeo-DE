const {app} = require('electron');

const {createAuthWindow, createLogoutWindow} = require('./auth-process');
const createAppWindow = require('./app-process');
const authService = require('./services/auth-service');
const gallagherService = require('./services/gallagher-discovery-service');

async function showWindow() {
  try {
    gallagherService.listen();
    await authService.refreshTokens();
    return createAppWindow();
  } catch (err) {
    createAuthWindow();
  }
}
app.on('ready', showWindow);

app.on('window-all-closed', app.quit);