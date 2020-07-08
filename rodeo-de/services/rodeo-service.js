const { ipcMain } = require('electron');
const graphql = require('graphql.js');
const authService = require('./auth-service');
const { rodeoServiceUrl } = require('../../env-variables.json');

let graph = null;

ipcMain.handle('animalsQuery', async () => {
    return await graph(`
        query {
            animals {
            items {
                animalId
                name
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