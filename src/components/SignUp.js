import React, {useState} from 'react'
import {useForm} from './useForm'
import Member from './Member';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';


export default function SignUp() {
    const [values,handleChange] = useForm({teamName:"",email:"",password:""});
    const [page, setPage] = useState(1);
    const [lines,setLines]= useState ([0]);
    const [team, setTeam] = useState ([]);
    const history = useHistory();

    const {t} = useTranslation();

    const handleSubmit = () =>{
        console.log(values);      
        console.log(team);
        history.push("/login");
    }
    return (
        <div>
            <div className="hdr"><h4 id="stat">{t('SignUp.status')} {page}/2</h4></div>
              {page===1 &&
                <form  className="custom-form">
                    
                    <h2>{t('SignUp.page1.header')}</h2>
                    <label>{t('SignUp.page1.label1')}</label>
                    <input type="text" name="teamName" value={values.teamName} onChange={handleChange} placeholder={t('SignUp.page1.label1')} required/>
                    <label>{t('SignUp.page1.label2')}</label>
                    <div className="team-list">
                        {console.log(team)}
                       
                        {lines.map(m => 
                                             
                        <Member key={m} id={m} initial = {team.length>0 && m<team.length ? team[m] : ""} pholder = {t('SignUp.page1.pholder')+(m+1)}
                        listState={{lines,setLines}} groupState={{group:team,setGroup:setTeam}}/>)}
                    
                    </div>
                    <div className="ft1">
                         <a href="#" onClick={(e)=>setPage(2)}>{t('SignUp.page1.nextLink')}{'>'}</a>
                    </div>
                  
                </form>
                
             }

             {page===2 &&
               <form  className="custom-form">
                    <h2>{t('SignUp.page2.header')}</h2>
                    <label>{t('Login.label1')}</label>
                    <input type="text" name="email" value={values.email} placeholder={t('Login.label1')} onChange={handleChange} required  />
                    <label>{t('Login.label2')}</label>
                    <input type="password" name="password" value={values.password} placeholder={t('Login.label2')} onChange={handleChange} required  />  
                     <div className="ft2">
                         
                        <a href="#" onClick={(e)=>setPage(1)}>{'<'}{t('SignUp.page2.prevLink')}</a>
                        <a href="#" onClick={handleSubmit}>{t('SignUp.page2.nextLink')}{'>'}</a>  
                     </div>
                           
                </form>
             
             
             }
           

        </div>
    )
}
