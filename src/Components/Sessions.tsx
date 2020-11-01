import React, {FC, useEffect, useState} from 'react';
import {ipcRenderer} from 'electron';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Animal, DevicesType} from '../Types/DevicesType';
import {useDispatch, useSelector} from 'react-redux';
import { AppState } from '../Redux/ConfigureStore';
import {AdsAnimal, AdsSession, SessionResponse} from '../Types/GallagherType';
import {Checkbox, CircularProgress, Divider, IconButton, TablePagination} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';
import SyncIcon from '@material-ui/icons/Sync';
import { green, red } from '@material-ui/core/colors';
import {setLoading} from '../Redux/Actions';
import { partition } from 'lodash';


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
    }
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
    const { weightSessions } = await ipcRenderer.invoke('weightSessions');
    const casted = res as SessionResponse;
    const sessions = casted["ads:body"]?.["ads:sessions"]?.["ads:session"] as AdsSession[];
    const mappedSessions = sessions?.map(session => {
      const weightSession = weightSessions?.items?.find((ws: any) => ws.gallagherSessionID === session['ads:session_id']);
      return {
        ...session,
        ['ads:sync']: weightSession?.isSync || false
      };
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
  
  const dispatch = useDispatch();
  
  const allAnimals = useSelector<AppState, Animal[]>(state => state.allAnimals);
  
  const onSessionClick = async (session: AdsSession) => {
    dispatch(setLoading(true));
    const res = await ipcRenderer.invoke("loadSessionById", 
      { sessionId: session['ads:session_id'], url: device.ipAddress});
    const singleSessionResponse = res as SessionResponse;
    const curSession = singleSessionResponse["ads:body"]?.["ads:sessions"]?.["ads:session"] as AdsSession;
    const animalsFromSession = curSession['ads:animals']?.['ads:animal'];
    const [animalsToSend, nonExistingAnimals] = partition(animalsFromSession,(animalFromSession: AdsAnimal) => {
      const match = allAnimals.find(
        a => a.lID?.toLocaleLowerCase() === animalFromSession?.['ads:animalId']?.['ads:tag']?.toLocaleLowerCase());
      animalFromSession.rodeoAnimalId = match?.animalId;
      return !!match;
    });

    const sessionInput = {
      gallagherSessionID: session['ads:session_id'],
      sessionName: session['ads:name'],
      sessionDate: session['ads:startDate'],
      animalWeights: animalsToSend?.map((a: AdsAnimal) => {
        return {
          weight: a['ads:weight']?.['ads:value'],
          dateWeight: a['ads:datetime'],
          animalID: a.rodeoAnimalId
        };
      }) || []
    };
    console.log(nonExistingAnimals);
    const sync = await ipcRenderer.invoke("syncSession", sessionInput);
    console.log(sync);
    
    await loadSessions(device.ipAddress);

    dispatch(setLoading(false));
    
  }
    
  const columns = [
    {field: 'id', headerName: '', align: 'right'},
    {field: 'deviceName', headerName: 'Устройство', align: 'right'},
    {field: 'dateOfSession', headerName: 'Дата на сесия', align: 'right'},
    {field: 'animalCount', headerName: 'Брой животни', align: 'center'},
    {field: 'sync', headerName: 'Синхронизирана', align: 'center'},
    {field: 'id1', headerName: '', align: 'center'},
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
                <TableRow title={session['ads:session_id']} key={session['ads:session_id']}>
                  <TableCell padding="checkbox">
                    <Checkbox inputProps={{ 'aria-label': 'select all desserts' }} />
                  </TableCell>
                  {/*<TableCell align="center">{session['ads:session_id']}</TableCell>*/}
                  <TableCell align="center">{session['ads:name']}</TableCell>
                  <TableCell align="center">{new Date(session['ads:startDate'])?.toDateString()}</TableCell>
                  <TableCell align="center">{session['ads:animals']?.['ads:attributes']?.['ads:count']}</TableCell>
                  <TableCell align="center">{session['ads:sync'] ? <CheckCircleIcon style={{ color: green[500] }}/> : <CancelIcon style={{ color: red[500] }} />}</TableCell>
                  <TableCell align="center">{!session['ads:sync'] && (
                    <IconButton aria-label="sync" title="Синхронизирай с Родео" onClick={() => onSessionClick(session)}>
                      <SyncIcon />
                  </IconButton>)
                  }</TableCell>
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