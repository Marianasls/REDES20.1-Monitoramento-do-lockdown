import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Main from './Main';
import Transmissao from './Transmissao';
import Horario from './Horario';
const Routes = () => {

    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Main} />
                <Route path="/transmissao" exact component={Transmissao} />
                <Route path="/horario" exact component={Horario} />
            </Switch>
        </BrowserRouter>
    )

}
export default Routes;