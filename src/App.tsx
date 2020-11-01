import React from 'react';

import { Provider } from 'react-redux'
import { Route, Switch } from 'react-router' // react-router v4/v5
import { ConnectedRouter } from 'connected-react-router'
import configureStore, { history } from './Redux/ConfigureStore';
import Index from './Layout/Index';
import Devices from './Components/Devices';

const store = configureStore({ });

const Home = () => (
  <Index>
    <Devices />
  </Index>
)

const RodeoDE = () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <>
        <Switch>
          <Route exact path="/*" render={() => <Home />} />
          {/*<Route render={() => (<div>Miss</div>)} />*/}
        </Switch>
      </>
    </ConnectedRouter>
  </Provider>
)
export default RodeoDE;
