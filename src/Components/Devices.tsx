import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { DevicesType } from '../Types/DevicesType';
import { makeStyles } from '@material-ui/core/styles';
import {CardActionArea, Divider, Grid} from '@material-ui/core';
import TW3 from '../../images/tw3.jpg';
import HR4 from '../../images/hr.jpg';
import {useDispatch, useSelector} from 'react-redux';
import {setAllDevices, setFilteredDevices, setSelectedDevice} from '../Redux/Actions';
import {Sessions} from './Sessions';
import DeviceSearch from './DeviceSearch';
import {AppState} from '../Redux/ConfigureStore';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  topRoot: {
    marginBottom: 20
  },
  media: {
    height: 150,
    width: 170,
    marginLeft: 35
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

const DEVICES_TYPE = {
  TW3: "TW3",
  HR4: "HR4"
}

export default () => {
  // const [devices, setDevices] = useState<DevicesType[]>([]);
  const filteredDevices = useSelector<AppState, DevicesType[]>(state => state.filteredDevices);
  const dispatch = useDispatch();
  const loadDevices = async () => {
    const res = await ipcRenderer.invoke('loadDevices');
    console.log(res);
    // setDevices(res);
    dispatch(setAllDevices([...res]));
    dispatch(setFilteredDevices([...res]));
  };

  useEffect(() => {
    loadDevices();
  }, []);
  
  const classes = useStyles();
  
  return (
    <Grid container justify="center">
      <Grid item sm={10}>
        <DeviceSearch />
      </Grid>
      <Grid item sm={10} className={classes.topRoot}>
        <Grid container className={classes.root} justify="flex-start" spacing={2}>
          { filteredDevices.map(device => {
            return (
              <Grid item container sm={4}>
                
                <Card className={classes.root} key={device.name} onClick={() => {
                  dispatch(setSelectedDevice(device));
                }}>
                  <CardActionArea>
                    <CardHeader/>
                    <img className={classes.media} src={device.type === DEVICES_TYPE.TW3 ? TW3 : HR4} alt="" />
                    <CardContent>
                      <h2>{device.type === DEVICES_TYPE.TW3 ? 'Кантар' : 'Четец'}</h2>
                      <h1>{device.name}</h1>
                      <h3>{(device.ipAddress)}</h3>
                      <p>Свързване с кантарно устройство</p>
                    </CardContent>
                    <CardActions disableSpacing>
                      <IconButton aria-label="add to favorites" onClick={loadDevices}>
                        <FavoriteIcon />
                      </IconButton>
                      <IconButton aria-label="share">
                        <ShareIcon />
                      </IconButton>
                    </CardActions>
                  </CardActionArea>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Grid>
      <Divider />
      <Grid item sm={10}>
        <Grid item>
          <Sessions />
        </Grid>
      </Grid>
    </Grid>
  );
};