import React, { Component } from 'react';
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom';

import Menu         from './components/menu.js';
import Post         from './components/post.js';
import Content      from './components/content.js';

import './App.css';


class App extends Component {
     render() {
          return (
               <Router>

                    <div className='app'>

                         <Menu />

                         <Switch>

                              <Route exact path='/' component={Content}/>

                              <Route exact path='/posts=([a-zA-Z0-9]*)' component={Post} />

                              <Route exact path='/(after|before)=([_a-zA-Z0-9]*)' component={Content} />

                              <Route render={()=>{return <Redirect to='/' />}} />

                         </Switch>

                    </div>

               </Router>
          );
     }
}

export default App;
