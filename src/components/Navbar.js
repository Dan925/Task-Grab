import React,{useContext,useState} from 'react'
import {Link,NavLink} from 'react-router-dom'
import { LoginContext } from './LoginContext';
import { useTranslation } from 'react-i18next';
export  const Navbar = () => {
    const {t,i18n} = useTranslation();
    const {loggedIn,setLoggedIn} = useContext(LoginContext);
    const [lang,setLang] = useState ("def");
   

    
    const handleLangChange = (e)=>{
        const l = e.target.value;
        setLang(l);
        i18n.changeLanguage(l);

    }
    
    return (
        <div className="navbar">
            <Link to="/home"><h1 className="logo">Task</h1></Link>
            <div className="nav-links">
                
                <NavLink activeClassName="active" to="/home">{t('navbar.link1')}</NavLink>
                
               {loggedIn&&<NavLink  activeClassName="active"  to="/create">{t('navbar.link2')}</NavLink>}
                {loggedIn?
                 <Link   to="/" onClick={()=>setLoggedIn(false)} >{t('navbar.link3')}</Link>
                 : <NavLink  activeClassName="active"  to="/login">{t('navbar.link4')}</NavLink>
                }
               <select name="lang" id="lang-select" className="custom-select" value={lang} onChange={handleLangChange}>
                   <option value="def" disabled>Select Language</option>
                   <option value="en">English</option>
                   <option value="fr">Français</option>
               </select>

            </div>
        </div>
    )
}
