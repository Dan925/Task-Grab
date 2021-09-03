import React,{useState,useContext} from 'react'
import { useForm } from './useForm'
import useFetch from './useFetch'
import Member from './Member';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { LoginContext } from './LoginContext';
import Login from './Login';
import toast,{Toaster} from 'react-hot-toast';
export default function CreateTask() {
   
    const {isLoading,data} = useFetch("http://localhost:8000/users/0");
    const [lines,setLines]= useState ([0]);
    const [steps, setSteps] = useState ([]);
    const history = useHistory();
    const {loggedIn} = useContext(LoginContext);

    const [values,handleChange] = useForm({title:"",assignedTo:-1,time:"",date:""});

    const {t} = useTranslation();

    const handleSubmit = async (e) => {
        e.preventDefault();
       
        
        const {title,assignedTo,time,date} = values;
        const asgned = Number.parseInt(assignedTo);
        const task = {title,assignedTo:asgned,isDone:false,date,time,steps};
        console.log(task);

       const res = await fetch("http://localhost:8000/tasks",{
           method:'POST',
           headers:{"Content-Type":"application/JSON"},
           body:JSON.stringify(task)
       });
       if(res.ok){
            toast.success(t('create.taskAddedMsg'));
        //    console.log("New Task added");
           history.push("/home");
       }
       

    }
    return (
        <div >
            <Toaster/>
            {loggedIn&&
                 <form className="custom-form">
                    <h2>{t('create.header')}</h2>
                    <label>{t('create.label1')}</label>
                    <input type="text" name="title" value={values.title} onChange={handleChange} placeholder={t('create.label1')}required/>
                    <label>{t('create.label2')}</label>
                        <div>
                        
                            {lines.map(m => 
                                                
                            <Member key={m} id={m} initial = {steps.length>0 && m<steps.length ? steps[m] : ""} pholder = {t('SignUp.status')+" "+(m+1)}
                            listState={{lines,setLines}} groupState={{group:steps,setGroup:setSteps}}/>)}
                        
                        </div>
                    <label>{t('create.label3')}</label>
                    <input className="form-control" id="date" name="date" value={values.date} onChange={handleChange} placeholder="YYYY-MM-DD" type="date" required/>
                    <label>{t('create.label4')}</label>
                    <input className="form-control" id="time" name="time"  type="time" value={values.time} onChange={handleChange} required/>
                    <div className="form-group">
                        <label className="form-check-label">{t('create.label5')}</label>
                        {data&& <select className="custom-select" value = {values.assignedTo} onChange={handleChange} name='assignedTo' required>
                        <option  value={-1} disabled>{t('create.label6')}</option>
                            {data.teamMembers.map((user,index) =>(

                            
                                <option key={index} value={index} >{user}</option>
                                
                            ))}
                        </select>}
                        {isLoading && 
                        <div>{t('Loading')}</div>
                        }
                    </div>
                    
                        
                    <div className="ftlg">
                        <button onClick={handleSubmit}>{t('create.btn')}</button>
                    </div>
                
                 </form>
            
            }

            {!loggedIn&& <Login/>}
           
            
        </div>
    )
}
