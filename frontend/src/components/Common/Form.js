import React from 'react'
import { Toaster } from 'react-hot-toast'
import { Box } from '@mui/system'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme)=>({
    form:{
        width:'20em',
        padding:'2rem',
         display:'flex',
         flexDirection:'column',
         margin:'0 auto',
         boxShadow:'4px 4px 10px rgba(0,0,0,.25)',
         gap:'1rem',
        [theme.breakpoints.up('sm')]:{
            width:'30em',
            padding:'3rem',

        },

    },
}));

function Form({children}) {
    const classes = useStyles();
    return (
        <div>
            <Toaster/>
            <Box
             component="form"
             noValidate
             autoComplete="off"
             className={classes.form}
            >
                {children}
            </Box>
        </div>
    )
}

export default Form;
