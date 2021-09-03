import React,{useState,useEffect} from 'react'
import { useHistory } from 'react-router';
import { FaSearch } from 'react-icons/fa';
import TaskDetails from './TaskDetails';
import { useForm } from './useForm';
import { useTranslation } from 'react-i18next';
const SearchBar = (props) => {

    const history = useHistory();
    const [tasks,setTasks]= useState(props.tasks);
    const team = props.team;
    const [values,handleChange] = useForm({sort:-1})
    const [advSearch,setAdvSearch] = useState(false);
    const [query,setQuery] = useState("");
    const [asgcheckedState, setasgChecked]=useState(new Array(team.length).fill(false));
    
    const [doneCheckedState, setDoneChecked]=useState(new Array(3).fill(false));
    
    const {t} = useTranslation();
    const handleMarkAsDone = async (task) =>{
        
        setTasks(tasks.map(elem => {
            if(elem.id===task.id){
                let v = elem;
                v.isDone=true;
                return v
            }
            return elem;
                
        }));
        
        const {title,date,time,steps,assignedTo}=task;
        const newT = {title,assignedTo,isDone:true,date,time,steps};
        const res = await fetch("http://localhost:8000/tasks/"+task.id,{
            method:'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newT)
        });
        if(res.ok){
            console.log("Task id="+task.id+" marked as done");
            return true;
        }else{
            console.log("ERROR: Marking as Done");
            return false
        }
    }
    
    const handleDelete = async (id) =>{
      const conf=  window.confirm(t('confirmMsg'));
      
        if(conf){
            setTasks(tasks.filter(elem=>elem.id!==id ));
            const res = await fetch("http://localhost:8000/tasks/"+id,{
                method:'DELETE'
            });
            if(res.ok){
                console.log("Task id="+id+" deleted");
                return true;
                
            }else{
                console.log("ERROR: Deleting Task");
                return false;
            }
        }
        return false;
      
    }


    const handleQuery = (e)=>{
        let q = e.target.value;
        var r = [...cp];
        setQuery(q);
        if(q){
            let n = r.filter(elem => {
                return elem.title.toLowerCase().includes(q.toLowerCase());
            });
           
            setTasks(n);
        }else{
            setTasks(r);
        }   
    }
    const handleAsgCheckChange = (index)=>{
        const update = asgcheckedState.map((elem,i)=> i===index?!elem:elem);
        setasgChecked(update);
    }
    const handleDoneCheckChange = (index)=>{
        console.log(index);
        const update = doneCheckedState.map((elem,i)=> {
            if(!elem && i===index)
                return true;
            return false;
        });
        setDoneChecked(update);
    }
    
    var cp = [...props.tasks];
    useEffect(()=>{
        
       var r = [...cp];
       
       
        switch (values.sort){
            case "0" :
                r.sort((a,b) => (a.title.toLowerCase()>b.title.toLowerCase()?1:-1));
                
            break;
            case "1" :
                r.sort((a,b) => (team[a.assignedTo].toLowerCase()>team[b.assignedTo].toLowerCase()?1:-1));
                
            break;
            case "2":
               
                r.sort((a,b)=>(Date.parse(a.date+" "+a.time) - Date.parse(b.date+" "+b.time)));
                   
                
            break;
            default:
                console.log("Default");

        }
        
        var as = [];

        
           
        asgcheckedState.forEach((el,i)=>{
            if(el)
                as.push(i);
        });
        if(as.length>0)
             r = r.filter(val => as.includes(val.assignedTo))
        

   
        if(doneCheckedState[1])
             r = r.filter(val => val.isDone || !val.isDone);
        if(doneCheckedState[1])
             r = r.filter(val => val.isDone);
        if(doneCheckedState[2])
            r = r.filter(val => !val.isDone);
    
        
       
        setTasks(r);
        

        
       
      
       

    },[values.sort,asgcheckedState,doneCheckedState])
   

    return (
        <div className="search-bar-container">
             
           
                <div>
                    <div className="search-bar">
                        <input type="text" name="search" className="form-control" placeholder={t('main.searchBar.pholder')} value={query} onChange={handleQuery}/>
                        <button >
                            <FaSearch size = "30px"/>
                        </button> 
                    </div>
                    <div className="adv-search">
                        {!advSearch&&  <a onClick={()=>setAdvSearch(true)}><p>{t('main.searchBar.advSearch.header')}{'>'}</p> </a>}
                        {advSearch&& <a onClick={()=>setAdvSearch(false)}><p>{'<'}{t('main.searchBar.advSearch.header')}</p> </a> }
                    
                    </div> 
                </div>
            
           
          
        
         {advSearch&&
                 <div className="adv-filters">
                    <form className="custom-form">
                        <p>{t('main.searchBar.advSearch.header')}</p>
                        <label>{t('main.searchBar.advSearch.sortLabel')}</label>
                        <select className="custom-select"name="sort" value={values.sort} onChange={handleChange} >
                        <option value={-1} disabled>{t('main.searchBar.advSearch.sortOpt0')}</option>
                            <option value={0}>{t('main.searchBar.advSearch.sortOpt1')}</option>
                            <option value={1}>{t('main.searchBar.advSearch.sortOpt2')}</option>
                            <option value={2}>{t('main.searchBar.advSearch.sortOpt3')}</option>
                        </select>
                        <label> {t('main.searchBar.advSearch.filterHeader')}</label>

                        <label> {t('main.searchBar.advSearch.filterLabel1')}</label>
                            
                            
                        <div className="ass-filter">
                            {
                                team.map((val,index)=>{
                                    return (
                                            <span key={index} className="filter">
                                                <input  type="checkbox" name="personCheck" checked={asgcheckedState[index]} onChange={()=>handleAsgCheckChange(index)}/>
                                                <label >{val} </label>
                                                                
                                            </span>
                                        
                                        
                                    )
                                })
                            }
                        </div>
                        
                        <label>{t('main.taskStatus.title')}</label>
                        <div className="ass-filter">
                            <span className="filter">
                                <input type="radio" name="status" checked={doneCheckedState[0]} onChange={()=>handleDoneCheckChange(0)} />
                                <label>{t('main.taskStatus.all')}</label>
                                
                            </span>
                            <span className="filter">
                                <input type="radio" name="status" checked={doneCheckedState[1]} onChange={()=>handleDoneCheckChange(1)} />
                                <label>{t('main.taskStatus.done')}</label>
                                
                            </span>
                            <span className="filter">
                                <input type="radio" name="status" checked={doneCheckedState[2]} onChange={()=>handleDoneCheckChange(2)} />
                                <label>{t('main.taskStatus.notDone')}</label>
                                
                            </span>
                        </div>
                        
                
                        
                    </form>
             </div>
            }
            <hr/>
             {tasks.map((item)=> (
                <TaskDetails key = {item.id} task={item} handleDelete={handleDelete} handleCheck={handleMarkAsDone}/>
            ))} 
           
        </div>
    )
}

export default SearchBar;