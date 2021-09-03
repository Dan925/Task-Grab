import React,{useState,useContext,useEffect} from 'react'
import {Link,useHistory} from 'react-router-dom'
import {useForm} from './useForm'
import { LoginContext } from './LoginContext'
import { useTranslation } from 'react-i18next';
export default function Login() {
    const {t} = useTranslation();
    const [values, setValues] = useState({email: "",password:""})
   
    const [validEmail,setValidEmail]=useState(true);
  
    const [validPassword,setValidPassword] = useState(true);
   const [errors,setErrors]= useState(new Array(2).fill(false));
    const {setLoggedIn} = useContext(LoginContext);
    const history = useHistory();


   
    const handleChange = (e)=>{
        const {name,value} = e.target;
        setValues({...values,[name]:value});
        if(name==="email"){
            setValidEmail(validateEmail(value));
        }
        else{
            setValidPassword(validatePassword(value));
         }    
           

    }
    const validateEmail = (val)=>{
        if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(val))
            return true;
        return false
    }
    const validatePassword = (val)=>{
        if(val.length<6)
            return false;
        return true;
    }
   
    const handleLogin = (e)=>{
        e.preventDefault();
        let v = [false,false];
        if(!validEmail)
            v[0]=true;
        if(!validPassword)
            v[1]=true;
        
        setErrors(v);

        
        if(values.email.length>0 && validEmail && values.password.length>0 && validPassword){
                    setLoggedIn(true)
                    history.push("/home");
        }
        
       
    }
    return (
        <div>
             <form  className="custom-form">
                <h2>{t('Login.header')}</h2>
                <label>{t('Login.label1')}</label> 
                <input type="text" 
                    name= "email" 
                    value= {values.email} 
                    onChange = {handleChange} 
                    
                    placeholder={t('Login.label1')}
                    required/>
                    
                    {errors[0]&& <p style = {{color:'red',fontSize:'0.8em'}}>{t('Login.error1')}</p>}
                   
               
                <label >{t('Login.label2')}</label> 
                <input type="password"
                    name = "password" 
                    value= {values.password} 
                    
                    onChange = {handleChange} 
                    required
                    placeholder={t('Login.label2')}/>
                 
                    {errors[1]&& <p style = {{color:'red',fontSize:'0.8em'}}>{t('Login.error2')}</p>}
                <button onClick ={handleLogin} type="submit" style={{marginTop:'10px'}} >{t('Login.btn')}</button>
               <div className="ftlg">
                     <Link  to="/signup">{t('Login.link')}</Link>
               </div>
                   
                
                
         </form>
        </div>
    )
}
