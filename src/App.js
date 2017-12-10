import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import Home from './components/home.js';
import Menu from './components/menu.js';

import './App.css';

class App extends Component {
     render() {
          return (
               <Router>
                    <div className='app'>

                         <Menu />

                         <Switch>
                              <Route exact path="/" component={Home}/>
                         </Switch>
                    </div>
               </Router>
          );
     }
}

export default App;
