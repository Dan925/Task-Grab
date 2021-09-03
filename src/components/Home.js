import React,{useContext} from 'react'
import useFetch from './useFetch'
import Tasks from './Tasks'
import { LoginContext } from './LoginContext'
import Login from './Login'
const Home = () => {
    const {loggedIn} = useContext(LoginContext);
    const {data, isLoading,error} = useFetch("http://localhost:8000/tasks");
  
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
export default Home

