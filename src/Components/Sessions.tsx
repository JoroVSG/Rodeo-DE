import React, {FC, useEffect, useState} from 'react';
import { ipcRenderer } from 'electron';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { DevicesType } from '../Types/DevicesType';
import {useSelector} from 'react-redux';
import { AppState } from '../Redux/ConfigureStore';
import { AdsSession, SessionResponse } from '../Types/GallagherType';
import {Checkbox} from '@material-ui/core';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sessions: {
      marginTop: 20,
    }
  }),
);

const SessionsPerDevice: FC = () => {
  
  const classes = useStyles();
  const [sessions, setSessions] = useState<AdsSession[]>([]);
  const device: DevicesType = useSelector<AppState, DevicesType>(state => state.device);

    const loadSessions = async (url: string) => {
      const res = await ipcRenderer.invoke('loadSessions', url);
      const casted = res as SessionResponse;
      setSessions(casted["ads:body"]?.["ads:sessions"]?.["ads:session"] as AdsSession[]);
    }
  
  useEffect(() => {
    if(device) {
      loadSessions(device.ipAddress);  
    }
  }, [device]);
  
  return sessions.length > 0 ? (
    <div className={classes.sessions}>
      <TableContainer component={Paper}>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  // indeterminate={numSelected > 0 && numSelected < rowCount}
                  // checked={rowCount > 0 && numSelected === rowCount}
                  // onChange={onSelectAllClick}
                  inputProps={{ 'aria-label': 'select all desserts' }}
                />
              </TableCell>
              <TableCell align="right">Устройство</TableCell>
              <TableCell align="right">Дата на сесия</TableCell>
              <TableCell align="right">Брой животни</TableCell>
              <TableCell align="right">Синхронизирана</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sessions.map((session) => (
              <TableRow key={session['ads:session_id']}>
                <TableCell></TableCell>
                <TableCell align="right">{device?.name}</TableCell>
                <TableCell align="right">{new Date(session['ads:startDate'])?.toDateString()}</TableCell>
                <TableCell align="right">{session['ads:animals']['ads:animal']?.length}</TableCell>
                <TableCell align="right">{false}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  ) : null
};

export const Sessions = SessionsPerDevice;