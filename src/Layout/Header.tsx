import React, { useState, useEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import { ipcRenderer, remote } from 'electron';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

export default function ButtonAppBar() {
  const classes = useStyles();

  const [profile, setProfile] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const getAsyncProfile = async () => {
      const prof = await ipcRenderer.invoke('profile');
      setProfile(prof);
    }
    getAsyncProfile();
  }, [])

  const logout = async() => {
    
    const logoutWindow = new remote.BrowserWindow({
      show: false,
    });
  
    logoutWindow?.loadURL('https://dev-ktt11zj0.eu.auth0.com/v2/logout');
  
    logoutWindow.on('ready-to-show', async () => {
      logoutWindow.close();
      await ipcRenderer.invoke('logout');
      remote.getCurrentWindow().close();
    });
  }

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Rodeo Desktop Edition - {profile?.name}
        </Typography>
        <Button color="inherit" onClick={logout}>Logout</Button>
      </Toolbar>
    </AppBar>
  );
}
