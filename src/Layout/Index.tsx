import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  createStyles,
  Divider,
  Drawer,
  List,
  ListItem,
  Theme,
  ListItemText,
  CssBaseline, Toolbar, Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {ipcRenderer} from "electron";
import {setSelectedDevice} from '../Redux/Actions';
import {useDispatch} from 'react-redux';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: 'auto',
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  }),
);
// @ts-ignore
export default ({ children }) => {
  
  const dispatch = useDispatch();

  const loadDevices = async () => {
    const res = await ipcRenderer.invoke('loadDevices');
    dispatch(setSelectedDevice(res))
  };
  
  const classes = useStyles()
  return (
    <div className={classes.root}>
      <Header />
      <CssBaseline />
      <Grid container justify="flex-start" spacing={0}>
        <Grid item sm={2}>
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="left"
          >
            <div className={classes.drawerContainer}>
              <Toolbar />
              <List>
                {['Устройства', 'Сесии', 'Експорт'].map((text, index) => (
                  <ListItem button key={text} onClick={loadDevices}>
                    <ListItemText primary={text} />
                  </ListItem>
                ))}
              </List>
            </div>
          </Drawer>
        </Grid>
        <Grid sm={8}>
          <main className={classes.content}>
            <Toolbar />
            {children}
          </main>
        </Grid>
      </Grid>
    </div>
  )
}