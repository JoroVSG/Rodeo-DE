import React, { useEffect, useState } from 'react';
import Header from './Header';
import {
  createStyles,
  Drawer,
  List,
  ListItem,
  Theme,
  ListItemText,
  CssBaseline, Toolbar, Grid
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {ipcRenderer} from "electron";
import {useDispatch} from 'react-redux';
import {setAllAnimals} from '../Redux/Actions';

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
  
  useEffect(() => {
    const getAllAnimals = async () => {
      const { animals } = await ipcRenderer.invoke('getAnimals');
      dispatch(setAllAnimals(animals.items));
    };
    getAllAnimals();
  }, []);

  const loadDevices = async () => {
    const token = await ipcRenderer.invoke('accessToken');
    console.log(token);
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