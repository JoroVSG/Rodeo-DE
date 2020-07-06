import React from 'react';
import ReactDom from 'react-dom';
import { ipcRenderer, remote } from 'electron';
const mainElement = document.createElement('div');
document.body.appendChild(mainElement);
const App = () => {
  const logout = async() => {
    
    const logoutWindow = new remote.BrowserWindow({
      show: false,
    });
  
    logoutWindow.loadURL('https://dev-ktt11zj0.eu.auth0.com/v2/logout');
  
    logoutWindow.on('ready-to-show', async () => {
      logoutWindow.close();
      await ipcRenderer.invoke('logout');
      remote.getCurrentWindow().close();
    });
  }

  const getUrl = async () => {
    const url = await ipcRenderer.invoke('gallagherUrl');
    console.log(url);
  }
  
  return (
    <>
      <h1>
        Hi from a react app
      </h1>
      <button onClick={logout}>Logout</button>
      <button onClick={getUrl}>GetUrl</button>
    </>
  )
};
ReactDom.render(<App />, mainElement);