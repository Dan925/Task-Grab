import React,{useContext} from 'react'
import useFetch from '../../hooks/useFetch'
import Tasks from '../Task/index';

import { LoginContext } from '../../context/LoginContext'
import Login from '../Login'
const Dashboard = () => {
    const {loggedIn} = useContext(LoginContext);
    const {data, isLoading,error} = useFetch("tasks/");
   
  
    return (
        <div className="home-content">
            
            {!loggedIn&& <Login/>}
             {error && loggedIn &&
                 <div>{error}</div>
             }

            {isLoading && loggedIn &&
                 <div>Loading.... </div>
            }
            {data && loggedIn &&
               <Tasks list = {data}/>
            }

        </div>
    )
}
export default Dashboard

