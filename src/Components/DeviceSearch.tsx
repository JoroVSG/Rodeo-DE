import React, {useEffect} from 'react';
import {DevicesType} from '../Types/DevicesType';
import {useDispatch, useSelector, useStore} from 'react-redux';
import {AppState} from '../Redux/ConfigureStore';
import {TextField} from '@material-ui/core';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import {setAllDevices, setFilteredDevices} from '../Redux/Actions';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchSessions: {
      marginBottom: 20,
    }
  }),
);

export default () => {
  const allDevices: DevicesType[] = useSelector<AppState, DevicesType[]>(state => state.allDevices);
  const filteredDev: DevicesType[] = useSelector<AppState, DevicesType[]>(state => state.filteredDevices);
  const {searchSessions} = useStyles();
  const dispatch = useDispatch();
  
  const filterAllDevices = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const dev = value 
      ? allDevices.filter(device => 
          device?.name?.toLocaleLowerCase()?.includes(e.target?.value?.toLocaleLowerCase()))
      : allDevices
    dispatch(setFilteredDevices([...dev]));
  };
  
  return (
    <div className={searchSessions}>
      <h2>Устройства ({ filteredDev?.length })</h2>
      <TextField label="Търсене" onChange={filterAllDevices} />
    </div>
  )
};