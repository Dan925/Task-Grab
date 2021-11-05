import React,{useContext,useState,useEffect} from 'react'
import {Link,NavLink} from 'react-router-dom'
import { LoginContext } from '../../context/LoginContext';
import { useTranslation } from 'react-i18next';
import LocalStorageService from '../../services/LocalStorageService';
import axiosInstance from '../../services/Axios';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

import { List,ListItem,Box,Drawer,Avatar } from '@mui/material';


function stringToColor(string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  function stringAvatar(user) {
    return {
      sx: {
        bgcolor: stringToColor(user.first_name+"   "+user.last_name),
      },
      children: `${user.first_name.toUpperCase()[0]}${user.last_name.toUpperCase()[0]}`,
    };
  }

export  const Navbar = () => {
    const {t,i18n} = useTranslation();
    const {loggedIn,setLoggedIn} = useContext(LoginContext);
    const [lang,setLang] = useState ("def");
    const [openDrawer,setOpenDrawer] = useState(false);
    const [mobileView, setMobileView] = useState(false);

    const user = LocalStorageService.getUser();
    const handleLangChange = (e)=>{
        const l = e.target.value;
        setLang(l);
        i18n.changeLanguage(l);

    }
    
    const handleLogout = ()=>{
        axiosInstance.post("users/logout/",{refresh:LocalStorageService.getRefreshToken()});
        axiosInstance.defaults.headers["Authorization"] = null;
        setLoggedIn(false);
        LocalStorageService.clearStorage();
    }

    const toggleDrawer =  () => {
        setOpenDrawer(!openDrawer);
      };

      useEffect(() => {
        const setResponsiveness = () => {
            if (window.innerWidth<900){ 
                return setMobileView(true);

            }
            return setMobileView(false)
            
              
          };
      
          window.addEventListener("resize", () => setResponsiveness());
      
          return () => {
            window.removeEventListener("resize", () => setResponsiveness());
          }
          
      },[]);
    return (
        <div className="navbar">
           <div style={{display:'flex',gap:'2em', alignItems:'center'}}>

            {mobileView&&
                
                <Box >
                    <MenuIcon onClick={toggleDrawer} sx={{cursor:'pointer'}}/> 
                   
                    <Drawer 
                        anchor="left"
                        open={openDrawer}
                        onClose={()=>setOpenDrawer(false)}
                    >   
                    <Box sx={{display:'flex',justifyContent:'flex-end',marginTop:'1rem', padding:'0 .5em',cursor:'pointer'}}>
                        <CloseIcon onClick={()=>setOpenDrawer(false)}/>

                    </Box>
                        
                        <List sx={{display:'flex', height:'100%', flexDirection:'column', justifyContent:'baseline', marginTop:'3rem',padding:'2rem', gap:'2rem'}}>
                           {loggedIn&&
                            <ListItem >
                                <NavLink activeClassName="active" to="/dashboard">{t('navbar.link1')}</NavLink>
                            </ListItem>
                            }
                            {loggedIn&&
                            <ListItem>
                               <NavLink  activeClassName="active"  to="/create-task">{t('navbar.link2')}</NavLink>
                            </ListItem> 
                            }
                           { loggedIn&&
                           <ListItem>
                                 <NavLink  activeClassName="active"  to="/create-group">Create Group</NavLink>
                            </ListItem>
                            }
                            { loggedIn&&
                            <ListItem>
                                <NavLink  activeClassName="active"  to="/invite-user">Invite User</NavLink>
                            </ListItem>
                            }

                            <ListItem>
                                    {loggedIn?
                                    <Link   to="/" onClick={handleLogout} >{t('navbar.link3')}</Link>
                                    : <NavLink  activeClassName="active"  to="/login">{t('navbar.link4')}</NavLink>
                                    }
                            </ListItem>
                            <ListItem>
                                <select name="lang" id="lang-select" className="custom-select" value={lang} onChange={handleLangChange}>
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                </select>
                            </ListItem>
                        </List>
                        
                    
                    </Drawer>
                

                </Box>
                
                }
            <Link id="logo-link" to="/dashboard"><h1 className="logo">Task</h1></Link>
           
           </div>
            {!mobileView&&
                <div className="nav-links">
                    
                   {loggedIn&& <NavLink activeClassName="active" to="/dashboard">{t('navbar.link1')}</NavLink>}
                    
                {loggedIn&&<NavLink  activeClassName="active"  to="/create-task">{t('navbar.link2')}</NavLink>}
                {loggedIn&&<NavLink  activeClassName="active"  to="/create-group">Create Group</NavLink>}
                {loggedIn&&<NavLink  activeClassName="active"  to="/invite-user">Invite User</NavLink>}
                    {loggedIn?
                    <Link   to="/" onClick={handleLogout} >{t('navbar.link3')}</Link>
                    : <NavLink  activeClassName="active"  to="/login">{t('navbar.link4')}</NavLink>
                    }
                <select name="lang" id="lang-select" className="custom-select" value={lang} onChange={handleLangChange}>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                </select>

                </div>

            }
            {user&& <Avatar {...stringAvatar(user)} />}

        </div>
    )
}
