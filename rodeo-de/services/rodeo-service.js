const { ipcMain } = require('electron');
const graphql = require('graphql.js');
const authService = require('./auth-service');
const { rodeoServiceUrl } = require('../../env-variables.json');

let graph = null;

ipcMain.handle('weightSessions', async () => {
    return await graph(`
        query {
            weightSessions{
            items {
              gallagherSessionID
              isSync
              whenSync
            }
          }
        }
    `)();
});

module.exports = {
    initGraphQLClient: () => {
         graph = graphql(rodeoServiceUrl, {
            method: "POST",
            headers: {
                "Authorization": () => `Bearer ${authService.getAccessToken()}`
            }
        })
    }
}