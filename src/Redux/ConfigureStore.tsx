import { createBrowserHistory } from 'history'
import {Action, applyMiddleware, compose, createStore, Reducer, Store} from 'redux'
import { routerMiddleware } from 'connected-react-router'
import createRootReducer from './Reducers';
import {Animal, DevicesType} from '../Types/DevicesType';

export const history = createBrowserHistory();

export type AppState = {
  device: DevicesType,
  allDevices: DevicesType[],
  allAnimals: Animal[],
  filteredDevices: DevicesType[],
  loading: boolean,
  history: History
} & any

export default function configureStore(preloadedState: any): Store<AppState> {
  const store = createStore<AppState, Action, unknown, unknown>(
    createRootReducer(history) as AppState,
    preloadedState,
    compose(
      applyMiddleware(
        routerMiddleware(history),
      ),
    ),
  )

  return store
}