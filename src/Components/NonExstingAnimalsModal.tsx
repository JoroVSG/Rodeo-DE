import React, { FC } from 'react';
import {AdsAnimal, AdsAnimalWeight, AdsNote, AdsNotes, AdsSession} from '../Types/GallagherType';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import _ from 'lodash';
import {green, red} from '@material-ui/core/colors';
import CancelIcon from '@material-ui/icons/Cancel';
import {Divider, Grid, IconButton, Paper, Typography} from '@material-ui/core';
import SyncIcon from '@material-ui/icons/Sync';
import TableContainer from '@material-ui/core/TableContainer';

type NonExistingAnimalsModalProps = {
  splittedAnimals: AdsAnimal[][],
  session: AdsSession | null
}

export const NonExistingAnimalsModal: FC<NonExistingAnimalsModalProps> = (props) => {
  const [existingAnimals, nonExistingAnimals] = props.splittedAnimals;
  const showNotes = (notes: AdsNote) : string => {
    const note = notes as AdsAnimalWeight;
    if (isNoteArray(notes)) {
      return notes?.map(note => note['ads:value'])?.join(' | ')
    }
    
    if (note != null) {
      return note?.['ads:value']?.toString();
    }
    
    return '';
  };

  const isNoteArray = (note: any): note is AdsAnimalWeight[] => note?.[0] !== undefined
  
  const allAnimalsWeight = _.flatten(props.splittedAnimals).map((animal: AdsAnimal) => animal?.['ads:weight']?.['ads:value']);
  
  const minMaxAverageLabel = (index: number): string | undefined => {
    if (index === 0) return 'Най-тежко';
    if (index === 1) return 'Средно тегло';
    if (index === 2) return 'Най-леко';
  }
  
  return (
    <>
      <Grid>
        <Divider />
        <Grid item xs={11}>
          <Grid container justify="space-between" spacing={2}>
            {[_.max(allAnimalsWeight), Math.round(_.meanBy(allAnimalsWeight)), _.min(allAnimalsWeight)].map((value, index) => (
              <Grid key={value} item>
                <div style={{textAlign: 'center'}}>{minMaxAverageLabel(index)}</div><Typography variant="h6" style={{textAlign: 'center'}}>{value}</Typography>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Divider style={{ marginBottom: 20 }} />
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table" size="small">
              <TableBody>
                {nonExistingAnimals.map(animal => (
                  <TableRow key={animal['rodeoAnimalId']?.toString()}>
                    <TableCell align="left">{animal['ads:animalId']?.['ads:tag'] || animal['ads:animalId']?.['ads:eid']}</TableCell>
                    <TableCell align="left">{showNotes(animal?.['ads:notes']?.['ads:note'])}</TableCell>
                    <TableCell align="left">{animal['ads:weight']?.['ads:value']}</TableCell>
                    <TableCell align="left"><CancelIcon style={{ color: red[500] }} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </>
  );
}