import React from 'react';
import {BrowserRouter , Switch, Route} from 'react-router-dom';

import NavBar from './NavBar';
import ItemCard from './post/ItemCard';
import Post from './post/Post';
import Login from './layouts/Login';
import Register from './layouts/Register';
import Settings from './layouts/Settings'
import Choose from './layouts/Choose';

class App extends React.Component{
    render(){
        return(
            <BrowserRouter>
            <NavBar />
            <div className="container">
            <Switch>
                <Route exact path='/' component={ItemCard}/>
                <Route exact path='/login' component={Login} />
                <Route excat path='/register' component={Register} />
                <Route excat path='/post/:id' component={Post} />
                <Route excat path='/settings' component={Settings} />
                <Route excat path='/choose' component={Choose}/>
            </Switch>
            </div>
            </BrowserRouter>
        )
    }
}

export default App