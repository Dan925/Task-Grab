import React,{useContext,useState,useEffect,useRef} from 'react'
import {Link,NavLink,useHistory} from 'react-router-dom'
import { LoginContext } from '../../context/LoginContext';

import { useTranslation } from 'react-i18next';
import LocalStorageService from '../../services/LocalStorageService';
import axiosInstance from '../../services/Axios';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { List,ListItem,Box,Drawer,Avatar,Button } from '@mui/material';
import { makeStyles } from '@mui/styles';




const useStyles = makeStyles((theme)=>({
    popup:{
        position:'absolute',
        height:'180px',
        width:'300px',
        boxShadow:'4px 4px 10px',
        backgroundColor:"#fff",
        right:'4px',
        top:'75px',
        zIndex:12,
        display:'flex',
        flexDirection:"column",
        padding:'0 0 0 1rem',
        

    },
   userBox1:{
        width:'100%',
        display:'flex',
        justifyContent:"flex-end",
        flexBasis:'10%',
        flexGrow:1,
   },
   userBox2:{
        width:'100%',
        display:'flex',
        flexBasis:'100%',
        flexGrow:1,
       
        gap:'1rem'
    
   }
}))
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
  
  function stringAvatar(user,addColor) {
    return {
      sx: {
        bgcolor: addColor?stringToColor(user.first_name+"   "+user.last_name):"#fff",
        color:addColor?"#fff":"#000",
        border:!addColor&&".5px solid #000",
        width:addColor?50:80 ,
        height:addColor?50:80,
        cursor:addColor&&"pointer"

      },
      children: `${user.first_name.toUpperCase()[0]}${user.last_name.toUpperCase()[0]}`,
    };
  }

export  const Navbar = () => {
    const {t,i18n} = useTranslation();
    const {state,dispatch} = useContext(LoginContext);
    const [lang,setLang] = useState ("def");
    const [openDrawer,setOpenDrawer] = useState(false);
    const [mobileView, setMobileView] = useState(false);
    const [openUserSettings, setOpenUserSettings] = useState(false);
    const history = useHistory()
    const classes = useStyles();
    const ref = useRef() 
    const user = state.user;
    const handleLangChange = (e)=>{
        const l = e.target.value;
        setLang(l);
        i18n.changeLanguage(l);

    }
    
    const handleLogout = ()=>{
        axiosInstance.post("users/logout/",{refresh:LocalStorageService.getRefreshToken()});
        axiosInstance.defaults.headers["Authorization"] = null;
        dispatch({type:'LOGOUT'});
        LocalStorageService.clearStorage();
        history.push('/')
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
           
        const checkIfClickedOutside = (e)=>{
            if (openUserSettings && ref.current &&  !ref.current.contains(e.target)) {
                //ref.current points to the navbar wrapper div
                //target isn't inside the navbar area so close the popup
                setOpenUserSettings(false);
            }
        }
      
          window.addEventListener("resize", setResponsiveness);
          document.addEventListener("mousedown",checkIfClickedOutside);

          return () => {
            window.removeEventListener("resize", setResponsiveness);
            document.removeEventListener("mousedown",checkIfClickedOutside);
          }
          
      },[openUserSettings]);
    return (
        <div className="navbar" ref={ref}>
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
                           {state.isLoggedIn&&
                            <ListItem >
                                <NavLink activeClassName="active" to="/dashboard">{t('navbar.link1')}</NavLink>
                            </ListItem>
                            }
                            {state.isLoggedIn&&
                            <ListItem>
                               <NavLink  activeClassName="active"  to="/create-task">{t('navbar.link2')}</NavLink>
                            </ListItem> 
                            }
                           { state.isLoggedIn&&
                           <ListItem>
                                 <NavLink  activeClassName="active"  to="/create-group">Create Group</NavLink>
                            </ListItem>
                            }
                            { state.isLoggedIn&&
                            <ListItem>
                                <NavLink  activeClassName="active"  to="/invite-user">Invite User</NavLink>
                            </ListItem>
                            }

                            <ListItem>
                                    {!state.isLoggedIn&& <NavLink  activeClassName="active"  to="/login">{t('navbar.link4')}</NavLink>
                                    }
                            </ListItem>

                            {/*TO-DO: complete translation
                             <ListItem>
                                <select name="lang" id="lang-select" className="custom-select" value={lang} onChange={handleLangChange}>
                                    <option value="en">English</option>
                                    <option value="fr">Français</option>
                                </select>
                            </ListItem> */}
                        </List>
                        
                    
                    </Drawer>
                

                </Box>
                
                }
            <Link id="logo-link" to="/dashboard"><h1 className="logo">Task</h1></Link>
           
           </div>
            {!mobileView&&
                <div className="nav-links">
                    
                   {state.isLoggedIn&& <NavLink activeClassName="active" to="/dashboard">{t('navbar.link1')}</NavLink>}
                    
                {state.isLoggedIn&&<NavLink  activeClassName="active"  to="/create-task">{t('navbar.link2')}</NavLink>}
                {state.isLoggedIn&&<NavLink  activeClassName="active"  to="/create-group">Create Group</NavLink>}
                {state.isLoggedIn&&<NavLink  activeClassName="active"  to="/invite-user">Invite User</NavLink>}
                {!state.isLoggedIn&&<NavLink  activeClassName="active"  to="/login">{t('navbar.link4')}</NavLink>}
                {/*TO-DO: complete translation 
                <select name="lang" id="lang-select" className="custom-select" value={lang} onChange={handleLangChange}>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                </select> */}

                </div>

            }

            {user&& <Avatar onClick={()=>setOpenUserSettings(!openUserSettings)} {...stringAvatar(user,true)} />}
            {user&&openUserSettings&&
            <Box
            className={classes.popup}
            >
                <Box className={classes.userBox1}>
                    <Button size="large" variant="text" onClick={handleLogout} >{t('navbar.link3')}</Button>
                </Box>
                <hr />
                <Box className={classes.userBox2}>
                    <Avatar {...stringAvatar(user,false)} />
                   <div>
                       <h4>{user.first_name+" "+user.last_name}</h4>
                       <p>{user.email}</p>
                   </div>
                </Box>
            </Box>
            }
        </div>
    )
}
