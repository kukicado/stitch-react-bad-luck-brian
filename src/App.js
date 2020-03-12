import React from 'react';

import { Router, Route, Switch } from 'react-router-dom';
import history from './utils/history';
import Home from './Home';
import { useAuth0 } from './react-auth0-spa';

function App() {
    const { loading } = useAuth0();

    if (loading) {
        return <div>Loading...</div>;
    }
    return (
        <div className="App">
            {/* Don't forget to include the history module */}
            <Router history={history}>
                <Switch>
                    <Route path="/" exact component={Home} />
                </Switch>
            </Router>
        </div>
    );
}

export default App;
