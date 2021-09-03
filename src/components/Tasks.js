




import {Link} from 'react-router-dom';
import { FaPlusCircle} from 'react-icons/fa';


import SearchBar from './SearchBar';
import useFetch from './useFetch';
import { useTranslation } from 'react-i18next';
const Tasks = ({list}) => {
    

    const {isLoading,data,error} = useFetch("http://localhost:8000/users/0");
    const {t} = useTranslation()
    return (
        <div className="task-list"  >
            <div className = "task-list-header">
                <h2>{t('main.header')}</h2> 
               <Link to = "/create" id="plus-link" >
                   < FaPlusCircle size = "30px"  />
               </Link>
              
              
               
            </div>
            {error  &&
                 <div>{error}</div>
             }

            {isLoading &&
                 <div>{t('Loading')} </div>
            }
            {data&&
             <SearchBar  tasks={list} team={data.teamMembers}/>
            }
           
            
            
            
           
           
           
           
        </div>
    )
}


export default Tasks


