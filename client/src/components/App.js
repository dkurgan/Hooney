import React from 'react';
import {BrowserRouter , Switch, Route, HashRouter} from 'react-router-dom';

import NavBar from './NavBar';
import ItemCard from './post/ItemCard';
import Post from './post/Post';
import Login from './auth/Login';
import Register from './auth/Register';
import Settings from './auth/Settings'
import Campage from './layouts/Campage';
import Verify from './auth/Verify'
import { Footer } from './layouts/Footer';
import ResetPassword from './auth/ResetPassword';
import UpdatePassword from './auth/UpdatePassword';

class App extends React.Component{
    render(){
        return(
            <HashRouter>
            <NavBar />
                <div className="container">
            <Switch>
                <Route exact path='/' component={ItemCard}/>
                <Route exact path='/login' component={Login} />
                <Route excat path='/register' component={Register} />
                <Route excat path='/post/:id' component={Post} />
                <Route excat path='/settings' component={Settings} />
                <Route excat path='/campage' component={Campage}/>
                <Route exact path='/verify/:token' component={Verify} />
                <Route excat path='/resetpassword' component={ResetPassword} />
                <Route exact path='/reset/:id' component={UpdatePassword} />
            </Switch>
            </div>
            <Footer/>
            </HashRouter>
        )
    }
}

export default App