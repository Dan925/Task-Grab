import {useState,useEffect} from 'react';
import axiosInstance from '../services/Axios';

//custom hook
const useFetch = (url)=> {

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    

    //useEffect hook, run at every render, dependency array input for specifying when to run the function on state change for ex
    useEffect(()=>{
    
      
      axiosInstance.get(url)
      .then((res)=>{
        if(!res || res.status !== 200){
          throw Error('could not fetch resource');
        }else{
          setData(res.data);
          setError(null);
          setIsLoading(false);
        }


      }).catch(err => {
      
          setIsLoading(false);
          setError(err.message);
        
        

       
      });
      


    },[url]);

    return { isLoading, data, error, setData }
}

export default useFetch;