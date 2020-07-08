const {app} = require('electron');

const {createAuthWindow} = require('./auth-process');
const createAppWindow = require('./app-process');
const authService = require('./services/auth-service');
const gallagherService = require('./services/gallagher-discovery-service');
const gallagherApiService = require('./services/gallagher-api-service');
const rodeoService = require('./services/rodeo-service');

async function showWindow() {
  try {
    gallagherService.listen();
    gallagherApiService.init();
    rodeoService.initGraphQLClient();
    await authService.refreshTokens();
    return createAppWindow();
  } catch (err) {
    createAuthWindow();
  }
}
app.on('ready', showWindow);

app.on('window-all-closed', app.quit);