




import {Link} from 'react-router-dom';
import { FaPlusCircle} from 'react-icons/fa';


import SearchBar from './search';
import useFetch from '../../hooks/useFetch';
import { useTranslation } from 'react-i18next';
const Tasks = () => {
    


    const {isLoading,data,error} = useFetch("users/groups/");
    const {t} = useTranslation()
    return (
        <div className="task-list"  >
            <div className = "task-list-header">
                <h2>{t('main.header')}</h2> 
               <Link to = "/create-task" id="plus-link" >
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
          
            <SearchBar  teams={data}/>
            }
           
            
            
            
           
           
           
           
        </div>
    )
}


export default Tasks


