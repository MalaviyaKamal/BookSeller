import React from 'react'
import { Typography, Button, Grid } from '@material-ui/core';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import TextFieldCustom from '../UI/TextField';
import Password from '../UI/PassWord';
import Select from '../UI/Select';
import authService from '../service/auth.service';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom';

export default function Register(props) {

  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    roleId: ''
  }


  const Option = [{id:3,name:'buyer'}, {id:2,name:'seller'}];

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name isRequired'),

    lastName: Yup.string().required('Last Name isRequired'),

    email: Yup.string().email('Email is invalid').required('Email is required'),

    password: Yup.string().required('Password is required').min(5, 'Password must be atleast 5 characters'),

    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Password must match').required('Confirm Password is required'),

    roleId: Yup.number().required('Role is required')
  })


  const onSubmit = (data) => {
    console.log("submitting")
    delete data.confirmPassword;
    authService.create(data).then((res) => {
      navigate("/login");
      toast.success("Successfully registered");
    });
  };
  return (
    < div style={{ overflow: 'hidden' }}>
      <br/>
      <Typography variant='h6' align='center' color='black' >
                Home &gt;<span style={{ color: 'red' }} >Login</span>
            </Typography>
            <br/>
            <Typography variant='h4' align='center' color='primary' style={{fontWeight:'bolder'}}>
                LOGIN or Create an Account
            </Typography>
            <hr color="black" width="15%" />


      <Formik
        validateOnChange='true'
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}>
        <Form >

           
          <Typography variant='h5' style={{ marginLeft: '5.55vw' }} >
            Personal Information
            </Typography>
           <hr/>
            <Typography variant='h6' style={{ marginLeft: '5.55vw' }} >
          <p class="paraStyle">Please Enter the following information to create Your Account.</p>
          </Typography>
          <Grid container justifyContent='space-evenly' >
            <Grid item xs={5}>
              <TextFieldCustom name='firstName' label="First Name" />
            </Grid>
            <Grid item xs={5}>
              <TextFieldCustom name='lastName' label="Last Name" />
            </Grid>
          </Grid>
          <br></br>
          <br></br>



          <Typography variant='h5' style={{ marginLeft: '5.55vw' }}>
            Email Address
          </Typography>
          <Grid container justifyContent='space-evenly' >
            <Grid item xs={5}>
              <TextFieldCustom name='email' label="email" />
            </Grid>
            <Grid item xs={5}>
              <Select name='roleId' options={Option} label='Roles' />
            </Grid>
          </Grid>
          <br></br>
          <br></br>


          <Typography variant='h5' style={{ marginLeft: '5.55vw' }}  >
            Login Information
          </Typography>
          <hr/>
          <Grid container justifyContent='space-evenly'  >
            <Grid item xs={5} >
              <Password name='password' label="Password" />
            </Grid>
            <Grid item xs={5}  >
              <Password name='confirmPassword' label="Confirm Password" />
            </Grid>
          </Grid>
          <br></br>



          <Grid container justifyContent='space-evenly'>
            <Grid item xs={5}>
              <Button type='submit' variant="contained" color="primary" size='large'>
                Register
              </Button>
            </Grid>
            <Grid item xs={5}>
              <Button variant="contained" color="secondary" size='large'
                onClick={()=>navigate('/login')}
              >
                Login
              </Button>
            </Grid>
          </Grid>

        </Form>
      </Formik>


    </div>

  )
}

