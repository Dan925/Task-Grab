import React from 'react'
import useFetch from '../../hooks/useFetch'
import Tasks from '../Task/index';


const Dashboard = () => {
  
    const {data, isLoading,error} = useFetch("tasks/");
   
  
    return (
        <div className="home-content">
            
         
             {error &&
                 <div>{error}</div>
             }

            {isLoading &&
                 <div>Loading.... </div>
            }
            {data && 
               <Tasks list = {data}/>
            }

        </div>
    )
}
export default Dashboard

