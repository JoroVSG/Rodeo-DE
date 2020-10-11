import { DevicesType } from '../Types/DevicesType';
import { SET_SELECTED_DIVICE } from './ReduxTypes';

export const setSelectedDevice = (device: DevicesType) => ({ type: SET_SELECTED_DIVICE, payload: device });
export const setAllDevices = (device: DevicesType[]) => ({ type: SET_SELECTED_DIVICE, payload: device });