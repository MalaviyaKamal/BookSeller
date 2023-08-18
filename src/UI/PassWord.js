import React from 'react'
import { Grid, TextField } from '@material-ui/core'
import { useField } from 'formik'

const Password = ({
    name, 
    ...otherProps
})=>{

  const [show,setShow] = React.useState(false); 
  const [field, meta] = useField(name);
  const configTextField = {
    fullWidth: true,
    autoComplete:"",
    ...field,
    ...otherProps,
    }
  
  if(meta && meta.touched && meta.error)
  {
    configTextField.error = true;
    configTextField.helperText = meta.error;
  } 

  const handleShow = ()=>{
    setShow(show=>!show);
  }
   
  return (
    <Grid container  style={{position:'relative'}} >
        <Grid item xs={12}  >
            <TextField {...configTextField} type={show?'text':'password'} />
        </Grid>
        <Grid item onClick={handleShow} style={{position:'absolute',top:17,cursor:'pointer',fontSize:'1rem',right:0}}>
            {show ?  'show' : 'hide' }
        </Grid>
    </Grid>
  )
}
export default  Password;