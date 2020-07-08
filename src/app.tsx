import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { ipcRenderer } from 'electron';
import { SessionResponse, AdsSession, AdsAnimals } from './types/GallagherType';
import Header from './header';
import { Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: '33.33%',
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
    },
  }),
);

const mainElement = document.createElement('div');
document.body.appendChild(mainElement);

const App = () => {
  const classes = useStyles();
  

  const [sessions, setSesstions] = useState<AdsSession[] | null>(null);
  const [currentSession, setCurrentSession] = useState<AdsSession | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);

  const loadSessions = async () => {
    setFetching(true);
    const res = await ipcRenderer.invoke('loadSessions');
    setFetching(false);
    const casted = res as SessionResponse;
    setSesstions(casted["ads:body"]?.["ads:sessions"]?.["ads:session"] as AdsSession[]);
  }

  const onSessionClicked = async (e: React.ChangeEvent<{}>, session: AdsSession, expanded: boolean) => {
    if (!expanded) {
      setFetching(true);
      const res = await ipcRenderer.invoke('loadSessionById', session?.["ads:session_id"]);
      setFetching(false);
      const singleSessionResponse = res as SessionResponse;
      const curSession = singleSessionResponse["ads:body"]?.["ads:sessions"]?.["ads:session"];
      
      setCurrentSession(curSession as AdsSession);
    }
  }

  const retrieveAccessToken = async () => {
    const aniamls = await ipcRenderer.invoke('animalsQuery');
    console.log(aniamls);
  }
  
  return (
    <>
      <Header />
      <Button color="primary" onClick={loadSessions}>Load Sessions</Button>
      <Button color="primary" onClick={retrieveAccessToken}>Retrieve Access Token</Button>
      <Button color="primary" onClick={() => {}}>Sync with Rodeo.bg</Button>
      {sessions && (
        <div className={classes.root}>
          {sessions.map((session) => {
            const expanded = session?.["ads:session_id"] === currentSession?.["ads:session_id"];
            return (
              <Accordion key={session["ads:session_id"]} onClick={e => onSessionClicked(e, session, expanded)} expanded={expanded}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography className={classes.heading}>{session["ads:name"]}</Typography>
                  <Typography className={classes.secondaryHeading}>{session["ads:startDate"]} - {session["ads:session_id"]}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  {fetching ? (
                    <div className={classes.root}>
                      <CircularProgress />
                    </div>
                  ): (
                    <>
                      <TableContainer component={Paper}>
                        <Table size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Animal ID</TableCell>
                              <TableCell>Weight Date</TableCell>
                              <TableCell>Weight</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {!!currentSession?.["ads:animals"]?.["ads:animal"]?.map && currentSession?.["ads:animals"]?.["ads:animal"]?.map((animal, index) => (
                              <TableRow key={animal["ads:animalId"]?.["ads:tag"] || index}>
                                <TableCell component="th" scope="row">
                                  {animal["ads:animalId"]?.["ads:tag"]}
                                </TableCell>
                                <TableCell>{animal["ads:datetime"]}</TableCell>
                                <TableCell>{animal["ads:weight"]} kg</TableCell>
                                
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </>
                  )}
                </AccordionDetails>
              </Accordion>
            )
          })}
        </div>
      )}
    </>
  )
};
ReactDom.render(<App />, mainElement);