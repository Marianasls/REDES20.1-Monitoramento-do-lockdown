import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './Main';
import Transmissao from './Transmissao';

const Routes = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/transmissao" exact component={Transmissao} />

            </Switch>
        </BrowserRouter>
    )

}
export default Routes;