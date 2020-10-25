import {Animal, DevicesType} from '../Types/DevicesType';
import {
  SET_SELECTED_DEVICE,
  SET_ALL_DEVICE,
  SET_FILTERED_DEVICE,
  SET_ALL_ANIMALS
} from './ReduxTypes';

export const setSelectedDevice = (device: DevicesType) => ({ type: SET_SELECTED_DEVICE, payload: device });
export const setAllDevices = (devices: DevicesType[]) => ({ type: SET_ALL_DEVICE, payload: devices });
export const setFilteredDevices = (devices: DevicesType[]) => ({ type: SET_FILTERED_DEVICE, payload: devices });
export const setAllAnimals = (animals: Animal[]) => ({ type: SET_ALL_ANIMALS, payload: animals });