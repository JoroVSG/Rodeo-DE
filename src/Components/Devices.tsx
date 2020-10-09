import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import clsx from 'clsx';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import { DevicesType } from '../Types/DevicesType';
import { makeStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';
import TW3 from '../../images/tw3.jpg';
import HR4 from '../../images/hr.jpg';

const useStyles = makeStyles((theme) => ({
  root: {
    // paddingTop: 20,
    flexGrow: 1,
  },
  media: {
    height: 150,
    width: 170,
    marginLeft: 70
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
  const [devices, setDevices] = useState<DevicesType[]>([]);

  const loadDevices = async () => {
    const res = await ipcRenderer.invoke('loadDevices');
    setDevices(res);
  };

  useEffect(() => {
    loadDevices();
  }, []);
  
  const classes = useStyles();
  
  return (
    <Grid container className={classes.root} justify="flex-start" spacing={2}>
      { devices.map(device => {
        return (
          <Grid item container sm={4}>
            <Card className={classes.root} key={device.name}>
              <CardHeader/>
              <img className={classes.media} src={device.type === DEVICES_TYPE.TW3 ? TW3 : HR4} alt="" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  <h2>Кантар</h2>
                  <h1>{device.name}</h1>
                  <p>Свързване с кантарно устройство</p>
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites" onClick={loadDevices}>
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        )
      })}
      
    </Grid>
  );
};