import React, { useState, useEffect } from 'react';
import ReactDom from 'react-dom';
import { ipcRenderer, remote } from 'electron';
import { SessionResponse, AdsSessions, AdsSession } from './types/GallagherType';
import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

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

  const [sessions, setSesstions] = useState<AdsSession[] | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const loadSessions = async () => {
    setFetching(true);
    const res = await ipcRenderer.invoke('loadSessions');
    setFetching(false);
    const casted = res as SessionResponse;
    console.log(res);
    setSesstions(casted["ads:body"]?.["ads:sessions"]?.["ads:session"]);
  }

  const [profile, setProfile] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const getAsyncProfile = async () => {
      const prof = await ipcRenderer.invoke('profile');
      setProfile(prof);
    }
    getAsyncProfile();
  }, [])
  
  return (
    <>
      {fetching && <CircularProgress />}
      <h1>
        Hi from a react app - 
        {' '}
        {profile?.name}
      </h1>
      <Button color="primary" onClick={logout}>Logout</Button>
      <Button color="primary" onClick={loadSessions}>Load Sessions</Button>
      {sessions && (
        <TableContainer component={Paper}>
          <Table size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session["ads:session_id"]}>
                  <TableCell component="th" scope="row">
                    {session["ads:name"]}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  )
};
ReactDom.render(<App />, mainElement);