import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router';
import { SET_ALL_DIVICE, SET_SELECTED_DIVICE } from './ReduxTypes';
import { AppState } from './ConfigureStore';

const device = (state = null, action: any) => action.type === SET_SELECTED_DIVICE ? action.payload: state;
const allDevice = (state = null, action: any) => action.type === SET_ALL_DIVICE ? action.payload: state;

export default (history: any) => combineReducers<AppState>({
  router: connectRouter(history),
  device,
  allDevice
});