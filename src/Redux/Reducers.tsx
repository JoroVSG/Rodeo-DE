import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import {
  SET_ALL_DEVICE,
  SET_SELECTED_DEVICE,
  SET_FILTERED_DEVICE,
  SET_ALL_ANIMALS,
  SET_LOADING
} from './ReduxTypes';
import { AppState } from './ConfigureStore';

const device = (state = null, action: any) => action.type === SET_SELECTED_DEVICE ? action.payload: state;
const allDevices = (state = [], action: any) => action.type === SET_ALL_DEVICE ? action.payload: state;
const filteredDevices = (state = [], action: any) => action.type === SET_FILTERED_DEVICE ? action.payload: state;
const allAnimals = (state = [], action: any) => action.type === SET_ALL_ANIMALS ? action.payload: state;
const loading = (state = false, action: any) => action.type === SET_LOADING ? action.payload: state;

export default (history: any) => combineReducers<AppState>({
  router: connectRouter(history),
  device,
  allDevices,
  allAnimals,
  filteredDevices,
  loading
});