const { ipcMain } = require('electron');
const graphql = require('graphql.js');
const authService = require('./auth-service');
const { rodeoServiceUrl } = require('../../env-variables.json');

let graph = null;

ipcMain.handle('weightSessions', async () => {
    return await graph(`
        query {
            weightSessions {
                items {
                  gallagherSessionID
                  isSync
                  whenSync
                }
            }
        }
    `)();
});

ipcMain.handle('getAnimals', async () => {
    return await graph(`
        query {
          animals {
            items {
              lID
              animalId
            }
          }
        }
    `)();
});

ipcMain.handle('syncSession', async (_, sessionInput) => {
    console.log(sessionInput);
    const sync = graph.mutate(`(@autodeclare) {
      addSession(sessionInput: $input) { 
       sessionID        
      }
    }`);
    return await sync({
        "input!sessionInput": sessionInput
    })
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