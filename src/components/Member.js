import React,{useState} from 'react'

import {FaPlus,FaMinus} from 'react-icons/fa'
export default function Member(props) {
    const n = props.id;
    const initial =props.initial;
    const [name,setName]=useState(initial);
    const {lines,setLines} = props.listState;
    const {group,setGroup} = props.groupState;
    const pholder = props.pholder;
    const handleChange = (e) =>{
        setName(e.target.value);
    }
    const addMember = ()=>{
        
        if(!group.includes(name))
             setGroup([...group, name]);
        setLines([...lines,lines[lines.length-1]+1]);
       
        

    }

    const removeMember = () =>{
        if(lines.length>1){
            setGroup(group.filter(elem =>elem!==name));
            setLines(lines.filter(elem=>elem!==n));
          
        }
            
    }
    return (
        <div className="group-member">
             <input type="text" name="name" value={name} onChange={handleChange} placeholder={pholder} required/>
              <button onClick={addMember} ><FaPlus /></button>
              <button onClick={removeMember}><FaMinus/></button>
        </div>
    )
}
