import React,{useState} from 'react'
import {useForm,Controller} from 'react-hook-form'
import { useTranslation } from 'react-i18next';
import toast,{ Toaster } from 'react-hot-toast';

import { 
    AccordionActions,
    Accordion,AccordionSummary,
    AccordionDetails,
    Button,
    TextField, 
    Select,MenuItem, 
    FormControl,
    FormHelperText,


 } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

import Typography from '@mui/material/Typography';
import axiosInstance from '../../services/Axios'

const TaskDetails = (props) => {
    const [expanded,setIsExpanded] = useState(false);
    const [task,setTask] = useState(props.task);
    const team = props.team;
    const asg = team.members.find(m=> m.id===task.assignee);
    const handleDelete = props.handleDelete;
    const handleCheck = props.handleCheck;
  
    const [editMode,setEditMode] = useState(false);
    const {t} = useTranslation();

    const handleTaskAccordion = ()=>{
        if(!editMode)
            setIsExpanded(!expanded)
    }
    const notifyMarkedAsDone = (task) =>{
       
        const res = handleCheck(task);  
        if(res)
          toast.success(`${t('markDoneMsg')}`);
    } 
    const notifyDelete =  (task)=>{      
        const res =  handleDelete(task.id);
       
        if(res)
             toast.error(`${t('deletedMsg')}`);
    }
    const notifyUpdate = ()=>{
        const res = updateTask();
        if(res){
            toast.success("Task successfully updated");
           setEditMode(false);

        }
    }
    const updateTask =  async ()=>{
        const values = getValues();
        if(!values.title){
            setError('title',{type:'required',message:'title is required'});
            return false;
        }
        else{
            const newT = {...values,assignee:getValues('assignee')?.id,group:team.id}
            try{
                const res = await axiosInstance.put('tasks/'+task.id+'/',newT);
                if(res && res.status === 200){
                    setTask({...task,...newT});
                    return true;
                }
                
                return false;
            }catch(e){
                console.log(e.message);
                return false;
            }
         }
        
    }
    const listTeamMembers = ()=>{
        return team.members.map((m,i)=>(
            m.user_name===asg?.user_name? <MenuItem key={i} selected value={m}>{m.user_name}</MenuItem>
            :<MenuItem key={i}  value={m}>{m.user_name}</MenuItem>
        ));
    }
    const defaultValues = {assignee:asg,description:task.description,title:task.title,is_done:task.is_done};
    const {control, getValues,setError, formState:{errors}} = useForm({defaultValues});
    return (
        <div className="task-details">
             <Toaster/>
             <Accordion expanded={expanded} onChange={handleTaskAccordion}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                
                aria-controls="panel1a-content"
                id="panel1a-header"
                sx={{backgroundColor:task.is_done?'var(--done-accent-clr)':'var(--notDone-accent-clr)'}}
                >

                {editMode?
                <Controller
                    name="title"
                    control={control}
                    
                    render={({field:{onChange,value}})=>(
                        <FormControl>
                        <TextField 
                        required
                        label="Title" 
                        variant="standard" 
                        color="info" 
                        focused value={value??""} 
                        onChange={onChange} />
                        {errors.title&& <FormHelperText error>*{errors.title.message}</FormHelperText>}
                        </FormControl>
                    )}
                    
                />
                
                
                :<Typography>{task.title}</Typography>}
              
                </AccordionSummary>
                <AccordionDetails>
                    <div className="detail-box1">
                        <label>Created at:  </label>
                        <p>{task.created_at.split('T')[0]+" "+task.created_at.split('T')[1].split('.')[0]}</p>
                    </div>
                    <div className="detail-box1">
                        <label>{t('main.taskStatus.title')} </label>
                        {editMode?
                            <Controller
                                    
                            name="is_done"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                            <FormControl >
                    
                                    <Select 
                                    value={value ?? ""} 
                                    onChange={onChange}
                                    
                                    >
                                        <MenuItem  value={true}>
                                       { t('main.taskStatus.done')}
                                        </MenuItem> 
                                        <MenuItem  value={false}>
                                        {t('main.taskStatus.notDone')}
                                        </MenuItem> 
                                    
                                    </Select>
                                
                            </FormControl>
                            )}
                            />

                        :<p>{task.is_done?t('main.taskStatus.done'):t('main.taskStatus.notDone')}</p>
                        }
                    </div>
                    <div className="detail-box1">
                        <label> {t('main.searchBar.advSearch.filterLabel1')} </label>
                       {editMode? 
                        <Controller
                                
                        name="assignee"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                        <FormControl >
                
                                <Select 
                                value={value ?? ""} 
                                onChange={onChange}
                                displayEmpty
                               
                                
                                renderValue={(selected)=> {
                                   
                                    return selected?.user_name ?? <em>Unassigned</em>
                                }}
                                >
                                    <MenuItem  value="">
                                                <em>Unassigned</em>
                                    </MenuItem> 
                                    {listTeamMembers()}
                                </Select>
                              
                        </FormControl>
                        )}
                    />
                    : <p>{asg?.user_name??"Unassigned"}</p>
                        }

                    </div>
                    
                    <hr />
                    <div className="detail-box2">
                        <label>Description:</label>
                        {editMode?
                        
                    
                        <Controller
                             
                            name="description"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                              <TextField 
                              sx={{mt:2.5}} 
                              multiline
                              id="outlined-required"
                              onChange={onChange} 
                             
                              value={value} 
                              label="Description" 
                              />
                            )}
                            />
                        :<p>{task.description??"..."}</p>}
                        
                        
                        
                    </div>
                
                </AccordionDetails>
                <AccordionActions>
                    
                    {!task.is_done&&!editMode&&
                        <Button startIcon={<CheckIcon />}variant="outlined"  color="success" size="small" onClick={()=>notifyMarkedAsDone(task)}>Mark as done</Button>
                    
                    }
                    
                    {!editMode&&<Button startIcon={<ModeEditIcon />}variant="outlined"  color="info" size="small"onClick={()=>setEditMode(true)} >Edit</Button>}
                   {!editMode &&<Button startIcon={<DeleteIcon />} variant="outlined"  color="error" size="small"  onClick={()=>notifyDelete(task)}>Delete</Button>}
                    {editMode&& <Button startIcon={<CancelIcon/>}variant="outlined"  color="error" size="small" onClick={()=>setEditMode(false)}>Cancel</Button>}
                    {editMode &&  <Button startIcon={<SaveIcon/>} variant="outlined"  color="success" size="small" onClick={notifyUpdate} >Save</Button>}
                </AccordionActions>
             </Accordion>

        </div>
        
    )
}

export default TaskDetails;
