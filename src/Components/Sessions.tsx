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
      maxHeight: 440,
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
    const casted = res as SessionResponse;
    setSessions(casted["ads:body"]?.["ads:sessions"]?.["ads:session"] as AdsSession[]);
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
    {field: 'animalCount', headerName: 'Брой животни', align: 'right'},
    {field: 'sync', headerName: 'Синхронизирана', align: 'right'}
  ];
  
  const rows = sessions.map(session => ({
    deviceName: device?.name,
    dateOfSession: new Date(session['ads:startDate'])?.toDateString(),
    animalCount: session['ads:animals']['ads:animal']?.length,
    sync: false
    
  }));
  
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
                    align='right'
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {/*{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {*/}
              {/*  return (*/}
              {/*    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>*/}
              {/*      {columns.map((column) => {*/}
              {/*        const value = row[column.field];*/}
              {/*        return (*/}
              {/*          <TableCell key={column.id} align={column.align}>*/}
              {/*            {column.format && typeof value === 'number' ? column.format(value) : value}*/}
              {/*          </TableCell>*/}
              {/*        );*/}
              {/*      })}*/}
              {/*    </TableRow>*/}
              {/*  );*/}
              {/*})}*/}
              {sessions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((session) => (
                <TableRow key={session['ads:session_id']}>
                  <TableCell padding="checkbox">
                    <Checkbox inputProps={{ 'aria-label': 'select all desserts' }} />
                  </TableCell>
                  <TableCell align="right">{device?.name}</TableCell>
                  <TableCell align="right">{new Date(session['ads:startDate'])?.toDateString()}</TableCell>
                  <TableCell align="right">{session['ads:animals']['ads:animal']?.length}</TableCell>
                  <TableCell align="right">{false}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      {/*<TableContainer component={Paper}>*/}
      {/*  <Table aria-label="simple table">*/}
      {/*    <TableHead>*/}
      {/*      <TableRow>*/}
      {/*        <TableCell padding="checkbox">*/}
      {/*          <Checkbox*/}
      {/*            // indeterminate={numSelected > 0 && numSelected < rowCount}*/}
      {/*            // checked={rowCount > 0 && numSelected === rowCount}*/}
      {/*            // onChange={onSelectAllClick}*/}
      {/*            inputProps={{ 'aria-label': 'select all desserts' }}*/}
      {/*          />*/}
      {/*        </TableCell>*/}
      {/*        <TableCell align="right">Устройство</TableCell>*/}
      {/*        <TableCell align="right">Дата на сесия</TableCell>*/}
      {/*        <TableCell align="right">Брой животни</TableCell>*/}
      {/*        <TableCell align="right">Синхронизирана</TableCell>*/}
      {/*      </TableRow>*/}
      {/*    </TableHead>*/}
      {/*    <TableBody>*/}
      {/*      {sessions.map((session) => (*/}
      {/*        <TableRow key={session['ads:session_id']}>*/}
      {/*          <TableCell padding="checkbox">*/}
      {/*            <Checkbox inputProps={{ 'aria-label': 'select all desserts' }} />*/}
      {/*          </TableCell>*/}
      {/*          <TableCell align="right">{device?.name}</TableCell>*/}
      {/*          <TableCell align="right">{new Date(session['ads:startDate'])?.toDateString()}</TableCell>*/}
      {/*          <TableCell align="right">{session['ads:animals']['ads:animal']?.length}</TableCell>*/}
      {/*          <TableCell align="right">{false}</TableCell>*/}
      {/*        </TableRow>*/}
      {/*      ))}*/}
      {/*    </TableBody>*/}
      {/*  </Table>*/}
      {/*</TableContainer>*/}
    </div>
  ) : null
};

export const Sessions = SessionsPerDevice;