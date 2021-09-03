import Home from './components/Home';
import {Navbar} from "./components/Navbar";
import Login from './components/Login'
import SignUp from './components/SignUp';
import CreateTask from './components/CreateTask';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { useState } from 'react';
import {LoginContext} from './components/LoginContext';
import NotFound from './components/NotFound';
function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  return (
    <Router>  
      <div className="App">
          <LoginContext.Provider value={{loggedIn,setLoggedIn}}>
            <Navbar/>
            <div className="content">
              <Switch>
                <Route exact path='/' component={Login}/>

                <Route exact path='/signup' component={SignUp}/>

                <Route exact path='/login' component={Login}/>

                <Route exact path='/home' component={Home}/>
        
                <Route exact path='/create' component={CreateTask}/>
                <Route component={NotFound}/>

              </Switch>
            </div>
          </LoginContext.Provider>

      </div>
    </Router>
  );
}

export default App;
