import React,{useState,useEffect} from 'react'
import { useTranslation } from 'react-i18next';


import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import {Box,Tabs, Tab} from '@mui/material';

import TaskDetails from './detail';
import axiosInstance from '../../services/Axios';



function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`full-width-tabpanel-${index}`}
        aria-labelledby={`full-width-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
    };
  }
  

const TaskList = (props) => {

    const {t,i18n} = useTranslation();
      
    const iniTasks = props.tasks;
    const teams = props.teams;
    const [value, setValue] = useState(0);
    const [tasks, setTasks] = useState(iniTasks);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    useEffect(() => { 
      //reset tasks for search if tasks prop changes
        setTasks(iniTasks);
     
    },[iniTasks]);
    const handleMarkAsDone = async (task) =>{
        
        setTasks(tasks.map(elem => {
            if(elem.id===task.id){
                let v = elem;
                v.is_done=true;
                return v
            }
            return elem;
                
        }));

        

        try{
            const res = await axiosInstance.patch(`tasks/${task.id}/`,{is_done:true});

            if(res && res.status===200){
                console.log("Task '"+task.title+"' marked as done");
                return true;
            }else{
                console.log("ERROR: Marking as Done");
                return false;
            }
        }
        catch(e){
            console.log("Exception: ",e.message);
            return false;
        }
    }
    
    const handleDelete = async (id) =>{
      const conf=  window.confirm(t('confirmMsg'));
      
        if(conf){
            setTasks(tasks.filter(elem=>elem.id!==id ));

            try{
                const res = axiosInstance.delete(`tasks/${id}/`);
                if(res && res.status === 204){
                    console.log("Task deleted");
                    return true;
                }else{
                    console.log("ERROR: Deleting Task");
                    return false;
                }

            }
            catch(e){
                console.log("Exception: ",e.message);
                return false;
            }

        }
        return false;
      
    }

    return (
        <div>
             <Box
                sx={{ width: '100%', borderBottom: 1, borderColor: 'divider'  }}

            >
            <Tabs

                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="scrollable auto tabs example"
                indicatorColor="secondary"
               
            >
               
                { teams&&
                    teams.map((team,index)=>(
                         
                        <Tab label={team.name} {...a11yProps(index)}  />

                    ))

                  
                }

            
            </Tabs>
                 {
                    teams.map((team,index)=>(
                      
                        <TabPanel value={value} index={index}>
                         
                           {
                              tasks.filter((task,index)=>task.group===team.id).map((item)=> (
                                <TaskDetails key = {item.id} task={item} handleDelete={handleDelete} handleCheck={handleMarkAsDone} team={team}/>
                            ))

                           }
                        </TabPanel>

                    ))
                }

        
            </Box>

        </div>
    )
}

export default TaskList
