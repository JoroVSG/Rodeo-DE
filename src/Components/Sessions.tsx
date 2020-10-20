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
import {Checkbox, Divider, TablePagination} from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    sessions: {
      marginTop: 20,
    },
    divider: {
      marginBottom: 20
    },
    root: {
      width: '100%',
    },
    container: {
      maxHeight: 700,
    },
  }),
);

const SessionsPerDevice: FC = () => {
  
  const classes = useStyles();
  const [sessions, setSessions] = useState<AdsSession[]>([]);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const device: DevicesType = useSelector<AppState, DevicesType>(state => state.device);

  const loadSessions = async (url: string) => {
    const res = await ipcRenderer.invoke('loadSessions', url);
    const weightSessions = await ipcRenderer.invoke('weightSessions');
    const casted = res as SessionResponse;
    const sessions = casted["ads:body"]?.["ads:sessions"]?.["ads:session"] as AdsSession[];
    const mappedSessions = sessions?.map(session => {
      const weightSession = weightSessions?.items?.find((ws: any) => ws.gallagherSessionID === session['ads:session_id']);
      session['ads:sync'] = weightSession?.isSync || false;
      return session;
    });
    setSessions(mappedSessions);
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    if(device) {
      loadSessions(device.ipAddress);  
    }
  }, [device]);
    
  const columns = [
    {field: 'id', headerName: '', align: 'right'},
    {field: 'deviceName', headerName: 'Устройство', align: 'right'},
    {field: 'dateOfSession', headerName: 'Дата на сесия', align: 'right'},
    {field: 'animalCount', headerName: 'Брой животни', align: 'center'},
    {field: 'sync', headerName: 'Синхронизирана', align: 'center'}
  ];
  
  return sessions.length > 0 ? (
    <div className={classes.sessions}>
      <h2>Сесии</h2>
      <p>Информация за сесиите в свързаното устройство</p>
      <Divider className={classes.divider} />

      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align='center'
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((session) => (
                <TableRow key={session['ads:session_id']}>
                  <TableCell padding="checkbox">
                    <Checkbox inputProps={{ 'aria-label': 'select all desserts' }} />
                  </TableCell>
                  <TableCell align="center">{device?.name}</TableCell>
                  <TableCell align="center">{new Date(session['ads:startDate'])?.toDateString()}</TableCell>
                  <TableCell align="center">{session['ads:animals']?.['ads:attributes']?.['ads:count']}</TableCell>
                  <TableCell align="center">{session['ads:sync'] ? <CheckCircleIcon/> : <CancelIcon />}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sessions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  ) : null
};

export const Sessions = SessionsPerDevice;