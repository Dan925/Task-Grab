import Dashboard from "./components/Dashboard/index";
import { Navbar } from "./components/Navigation/index";
import Login from "./components/Login";
import SignUp from "./components/SignUp/index";
import CreateTask from "./components/Task/create";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import NotFound from "./components/NotFound";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CreateGroup from "./components/Group/create";
import InviteUser from "./components/Group/invite";
import PrivateRoute from "./components/Common/PrivateRoute";
import LoginContextProvider from "./context/LoginContext";
import TaskContextProvider from "./context/TaskContext";
const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
    secondary: {
      main: "#EF616C",
    },
  },
});

function App() {
  return (
    <Router>
      <div className="App">
        <LoginContextProvider>
          <TaskContextProvider>
            <ThemeProvider theme={theme}>
              <Navbar />
              <div className="content">
                <Switch>
                  <Route exact path="/" component={Login} />
                  <PrivateRoute path="/dashboard" component={Dashboard} />
                  <Route exact path="/signup" component={SignUp} />
                  <Route exact path="/login" component={Login} />
                  <PrivateRoute path="/create-task" component={CreateTask} />
                  <PrivateRoute path="/create-group" component={CreateGroup} />
                  <PrivateRoute path="/invite-user" component={InviteUser} />
                  <Route component={NotFound} />
                </Switch>
              </div>
            </ThemeProvider>
          </TaskContextProvider>
        </LoginContextProvider>
      </div>
    </Router>
  );
}

export default App;
