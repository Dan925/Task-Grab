import React,{useState} from 'react'


import { useTranslation } from 'react-i18next';

import TaskList from './list';

import {Box,Typography,FormLabel,Radio,RadioGroup,Button,IconButton,FormControlLabel, Select,MenuItem, FormControl,InputLabel, FormHelperText} from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SortIcon from '@mui/icons-material/Sort';

import {useForm,Controller, useWatch} from 'react-hook-form';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles((theme)=>({
  advFilters:{  
    display:'block',
    width:'18em',
    position:'absolute',
    right:'12vw',
   
    zIndex:20,
  },
  form:{
    width:'20em',
    padding:'1rem',
     display:'flex',
     flexDirection:'column',
     margin:'0 auto',
     boxShadow:'4px 4px 10px rgba(0,0,0,.25)',
     gap:'1rem',
     backgroundColor: '#fff',

    },
    hdr:{
        display:'flex',
        justifyContent:'space-between'
    },
    clrBtn: {
        width: '10em',
       

    }
  
}));


const SearchBar = (props) => {
    const classes = useStyles();
    const tasksCp = props.tasks;
    const teamsCp = props.teams;
    const [tasks,setTasks]= useState(props.tasks);
    const [teams,setTeams] = useState(props.teams);
    const SORT_BY  = {"TITLE":0,"ASSIGNEE":1,};
    const FILTER_BY = {"STATUS_DONE":'0',"STATUS_NOT_DONE":'1',"ASSIGNEE":'2'};
   
    const [advSearch,setAdvSearch] = useState(false);
    const [sortValue,setSortValue] = useState();
    const [statusFilter,setStatusFilter] = useState();
    const [assigneeFilter,setAssigneeFilter] = useState();



    const [query,setQuery] = useState("");
   
    const {t} = useTranslation();
    


      
    const { control,setError, formState:{errors}} = useForm();
    const watchTeam = useWatch({
        control,
        name:'group',
        defaultValue: false,
    });


    const handleQuery = (e)=>{
        let q = e.target.value;

        let t = tasksCp.map(task=>({...task}));
        let g = teamsCp.map(team=>({...team}));
        setQuery(q);
        if(q){
            let nT = t.filter(elem => {
                return elem.title.toLowerCase().trim().includes(q.toLowerCase().trim());
            });
            let nG =  g.filter(elem=>{
                let isTaskInside = false;
                nT.forEach(t=>{
                    if (t.group===elem.id) isTaskInside = true;
                });
                return isTaskInside;
            });
           

            setTasks(nT);
            setTeams(nG);
        }else{
            setTasks(t);
            setTeams(g)
        }   
    }
    


    const getUsernameByIDTeamId = (personId,teamId)=>{
        return teams.find(t=>t.id===teamId).members.find(m=>m.id===personId)?.user_name;
    }
    
    const handleSortTasks = (e)=>{ 
        let field = e.target.value;

        setSortValue(field);

        let t = tasksCp.map(task=>({...task}));
      
        switch(field){
            case SORT_BY["TITLE"]:
                t.sort((a,b) => (a.title.toLowerCase()>b.title.toLowerCase()?1:-1));
                break;
            case SORT_BY["ASSIGNEE"]:
                t.sort((a,b)=>{
                    if (!a.assignee) return 1;
                   return a.group===b.group&&getUsernameByIDTeamId(a.assignee,a.group)?.toLowerCase()>getUsernameByIDTeamId(b.assignee,b.group)?.toLowerCase()?1:-1
                });
                break;
            default:
                console.log("Invalid sort field");
            
        }
        setTasks(t);
    }

    
   
    
    const handleStatusFilterTasks=(e)=>{
        let status = e.target.value;
        setStatusFilter(status);
        let t = tasksCp.map(task=>({...task}));

        switch(status){
            case FILTER_BY['STATUS_DONE']:
              t = t.filter(t=>t.is_done);
              break;
            case FILTER_BY['STATUS_NOT_DONE']:
                t = t.filter(t=>!t.is_done);
                break;
            default:
                console.log("show all");

        };

        setTasks(t);
      
     

    }

    const handleAssigneeFilter = (e) =>{
        let assignee = e.target.value;
        setAssigneeFilter(assignee);
        let t = tasksCp.map(task=>({...task}));
            
        if (assignee === -1)
            assignee = null;
        t = t.filter(task=>{
            if (task.group===watchTeam)
                return task.assignee === assignee;
            return 1;
        })
       setTasks(t);
     
    }

    const handleClearAdvSrch = ()=>{
        let t = tasksCp.map(task=>({...task}));
        setTasks(t);
        setSortValue();
        setStatusFilter();
        setAssigneeFilter();
       
        
    }
    return (
       

        <div className="search-bar-container">
             
           
                <div>
                    <div className="search-bar">
                        <input type="text" name="search" className="form-control" placeholder={t('main.searchBar.pholder')} value={query} onChange={handleQuery}/>
                    </div>
                    <div className="adv-search">
                       
                        
                        <IconButton onClick={()=>setAdvSearch(!advSearch) } color="primary">
                            <SortIcon/>
                            <FilterAltIcon/>
                        </IconButton>
                       
                    
                    </div> 
                </div>
            
           
         
        
         {advSearch&&
                <Box
                className={classes.advFilters}
                >
                    <Box
                    className={classes.form}
                    component="form"
                    noValidate
                    autoComplete="off"
                    >
                    <div className={classes.hdr}>

                      <Typography variant="h6" textAlign="center">Sort/Filters</Typography>
                      <Button size="small" className={classes.clrBtn} onClick={handleClearAdvSrch}>
                        Clear
                      </Button>
                    </div>

                    
                      <FormControl >
                            <InputLabel id="sort-select-label">Sort By</InputLabel>
                            <Select 
                            labelId="sort-select-label"
                            label="Sort By"
                            value={sortValue ?? ""} 
                            onChange={handleSortTasks}>
                                <MenuItem value={SORT_BY['TITLE']}>Title</MenuItem>
                                <MenuItem value={SORT_BY['ASSIGNEE']}>Assignee</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl component="fieldset" >
                            <FormLabel component="legend">Filter By Status:</FormLabel>
                            <RadioGroup 
                                value = {statusFilter||null}
                                onChange={handleStatusFilterTasks}
                            
                            row
                            >
                               
                                <FormControlLabel 
                                value={FILTER_BY['STATUS_DONE']}
                                control = {<Radio/>}
                                label="Done"
                                />
                                <FormControlLabel 
                                value={FILTER_BY['STATUS_NOT_DONE']}
                                control = {<Radio/>}
                                label="Not Done"
                                />
                               
                            </RadioGroup>
                        </FormControl>


                    
                       
                                
                          
                        
                        <FormLabel component="legend">Filter By Assignee:</FormLabel>
                        
                            <Controller
                            name="group"
                            control={control}
                            render={({ field: { onChange, value } }) => (
                               <FormControl required>
                                   
                                    <InputLabel id="team-select-label">Team</InputLabel>
                                    <Select 
                                    labelId="team-select-label"
                                    label="Team"
                                    value={value ?? ""} 
                                    onChange={onChange}>
                                        { 
                                            teams.map((team,index)=>(
                                                <MenuItem key={index} value={team.id}>{team.name}</MenuItem>
                                            ))
                                        }
                                    </Select>
                                   {errors.group&& <FormHelperText error>*{errors.group.message}</FormHelperText>}
                               </FormControl>
                            )}
                          />
                          

                          
                          
                                
                          
                         
                        {watchTeam&&




                           
                                <FormControl >
                                        <InputLabel id="assignee-select-label">Assignee</InputLabel>
                                        <Select 
                                        labelId="assignee-select-label"
                                        value={assigneeFilter ?? ""} 
                                        onChange={handleAssigneeFilter}
                                        label="Assignee"
                                 
                                      
                                        >
                                             <MenuItem  value={-1}>
                                                Unassigned
                                            </MenuItem>
                                            {
                                                teams.find(team=>team.id===watchTeam)?.members.map((m,i)=>(
                                                    <MenuItem key={i}  value={m.id}>{m.user_name}</MenuItem>
                                                ))
                                            }
                                        </Select>
                                      
                                </FormControl>
                                
                          
                            
                        }


                        

                    </Box>



                </Box>
           
            }
            <hr/>
            <TaskList tasks={tasks} teams={teams}/>
            
           
        </div>
    )
}


export default SearchBar;