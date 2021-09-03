import React,{useState} from 'react'
import useFetch from './useFetch';
import {FaCheck,FaTrash,FaAngleUp,FaAngleDown} from 'react-icons/fa'
import { useTranslation } from 'react-i18next';
import toast,{ Toaster } from 'react-hot-toast';
const TaskDetails = (props) => {
    const task = props.task;
    const handleDelete = props.handleDelete;
    const handleCheck = props.handleCheck;
    const {isLoading,data,error} = useFetch("http://localhost:8000/users/0");
    const asgned = data?data.teamMembers[task.assignedTo]:"";
    const [openDetails,setOpenDetails] = useState(false);
    const {t} = useTranslation();
    const notifyMarkedAsDone = (task) =>{
       
        const res = handleCheck(task);  
        if(res)
          toast.success(`${task.title} ${t('markDoneMsg')}`);
    } 
    const notifyDelete = async (task)=>{      
        const res =  await handleDelete(task.id);
       
        if(res)
             toast.error(`${task.title} ${t('deletedMsg')}`);
    }

    return (
        <div className="task-details">
             <Toaster/>
            <div >
                
                
                <div className="task-preview" style={{backgroundColor:  task.isDone?"var(--done-accent-clr)":"var(--notDone-accent-clr)"}} key = {task.id}>
                    {!openDetails && <a onClick={()=>setOpenDetails(true)}><FaAngleUp size="20px"/></a>}
                    {openDetails && <a onClick={()=>setOpenDetails(false)}><FaAngleDown size="20px"/></a>}
                    
                    <h2>{task.title} </h2>
                    
                    <p>{task.date+" "+task.time}</p>
                    {!task.isDone&&
                        <a onClick={()=>notifyMarkedAsDone(task)}><FaCheck size="20px"/></a>
                    }
                    
                    <a onClick={()=>notifyDelete(task)}><FaTrash size="20px"/></a>
                </div>

               
            </div> 
            { openDetails &&
                
                <div className = "task-more">
                    {error  &&
                        <div>{error}</div>
                    }

                    {isLoading &&
                        <div>{t('Loading')} </div>
                    }
                    {data &&
                        <div className="detail-container">
                            <div className="detail-box1">
                                <label>{t('main.taskStatus.title')} </label>
                                <p>{task.isDone?t('main.taskStatus.done'):t('main.taskStatus.notDone')}</p>
                            </div>
                            <div className="detail-box1">
                                <label> {t('main.searchBar.advSearch.filterLabel1')} </label>
                                <p>{asgned}</p>
                            </div>
                           <div className="detail-box2">
                                 <label> {t('main.taskDetails.stepLabel')}</label>
                                <hr />
                                            
                                <ol>
                                    {
                                        
                                        task.steps.map((step,index) => {
                                            return (
                                                <li key={index}>                                      
                                                     {step}
                                                </li>

                                            )                    
                                        
                                        })
                                    }
                                </ol>
                                
                                
                           </div>
                            
                        </div>
                    }
                    
                 </div>
            }

        </div>
        
    )
}

export default TaskDetails;
