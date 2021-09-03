import {useState,useEffect} from 'react';

//custom hook
const useFetch = (url)=> {

    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    

    //useEffect hook, run at every render, dependency array input for specifying when to run the function on state change for ex
    useEffect(()=>{
      const abortCont = new AbortController();
      
      

      fetch(url ,{ signal: abortCont.signal, withCredentials:true}).then(res => {
      if(!res.ok)
          throw Error('could not fetch resource');

        return res.json();
    
      }).then(data => {

          setData(data); 
          setIsLoading(false);
          setError(null);

      }).catch(err => {
        if(err.name === 'AbortError'){
          console.log('Fetch aborted to cancel fetch request for the component ');
        }else{
          setIsLoading(false);
          setError(err.message);
        
        }

       
      });

      return ()=> abortCont.abort();

    },[url]);

    return { isLoading, data, error, setData }
}

export default useFetch;