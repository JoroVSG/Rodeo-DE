import { DevicesType } from '../Types/DevicesType';
import {
  SET_SELECTED_DIVICE,
  SET_ALL_DIVICE,
  SET_FILTERED_DIVICE
} from './ReduxTypes';

export const setSelectedDevice = (device: DevicesType) => ({ type: SET_SELECTED_DIVICE, payload: device });
export const setAllDevices = (devices: DevicesType[]) => ({ type: SET_ALL_DIVICE, payload: devices });
export const setFilteredDevices = (devices: DevicesType[]) => ({ type: SET_FILTERED_DIVICE, payload: devices });