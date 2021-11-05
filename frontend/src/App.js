import Dashboard from './components/Dashboard/index';
import {Navbar} from "./components/Navigation/index";
import Login from './components/Login'
import SignUp from './components/SignUp/index';
import CreateTask from './components/Task/create';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { useState } from 'react';
import {LoginContext} from './context/LoginContext';
import NotFound from './components/NotFound';
import LocalStorageService from './services/LocalStorageService';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CreateGroup from './components/Group/create';
import InviteUser from './components/Group/invite';
const theme = createTheme({
  palette:{
    primary:{
      main:'#000',
    },
    secondary:{
       main: '#EF616C',
      },
     
  }
  
});

function App() {
  const isLoggedIn = LocalStorageService.getAccessToken();
  const [loggedIn, setLoggedIn] = useState(isLoggedIn?true:false);
  return (
    <Router>  
      <div className="App">
          <LoginContext.Provider value={{loggedIn,setLoggedIn}}>
            <ThemeProvider theme={theme}>
              <Navbar/>
              <div className="content">
                <Switch>
                  <Route exact path='/' component={Login}/>
                   <Route exact path='/dashboard' component={Dashboard}/>
                  <Route exact path='/signup' component={SignUp}/>

                  <Route exact path='/login' component={Login}/>

              
          
                  <Route exact path='/create-task' component={CreateTask}/>
                  <Route exact path='/create-group' component={CreateGroup}/>
                  <Route exact path='/invite-user' component={InviteUser}/>

                  <Route component={NotFound}/>

                </Switch>
              </div>

            </ThemeProvider>
          </LoginContext.Provider>

      </div>
    </Router>
  );
}

export default App;
