import React from 'react'
import { Typography, Button, Container, Grid } from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import TextFieldWrapper from '../UI/TextField';
import Password from '../UI/PassWord';
import * as Yup from 'yup';
import { Form, Formik } from 'formik';
import authService from '../service/auth.service';
import { toast } from "react-toastify";
import { useAuthContext } from '../contexts/auth';



export default function Login() {

  const authContext = useAuthContext();

    const initialValues = {
        email: '',
        password: ''
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Email is invalid').required('Email is required'),

        password: Yup.string().required('Password is required').min(5, 'Password must be atleast 5 characters'),
    })

    const onSubmit = (data) => {
        console.log("LOGIN ......")
        authService.login(data).then((res) => {
            toast.success("Successfully registered");
            // console.log("res",res);
            authContext.setUser(res);
            // setLogin(true);
            navigate("/");
        });
    }

    const navigate = useNavigate();
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
            <Grid container style={{ height: '80vh', marginTop: '0vh' }} alignItems='center' >
                <Grid item xs={12} sm={6}  style={{ height: '80%', borderRight: '1.5px solid grey' }} >
                    <Typography variant='h5' align='center' color='primary'>
                        New Customer
                    </Typography>
                    <div style={{ height: 50 }}></div>
                    <Typography variant='h6' style={{ marginLeft: '5.5vw' }}>
                        Registration free and Easy
                    </Typography>
                    <Container maxWidth='sm'>

                        <ul style={{ fontSize: 'larger' }}>
                            <li>Faster checkout</li>
                            <li >Save Multiple Shipping Address</li>
                            <li>View and track Orders and more</li>
                        </ul>
                    </Container>
                    <div style={{ height: 100 }}></div>

                    <Button variant="contained" color="primary" size='large'
                        onClick={() => navigate('/register')}
                        style={{ marginLeft: '5.5vw' }}
                    >
                        Create Account
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6} style={{ borderLeft: '1.5px solid grey', height: '80%' }} >
                    <Typography variant='h5' align='center' >
                        Registered Customer
                    </Typography>
                    <div style={{ height: 50 }}></div>
                    <Formik
                        validateOnChange='true'
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}>
                        <Form style={{ width: '50%', minWidth:'350px',marginLeft: '12vw' }}>
                            <div style={{ height: '20vh' }}>

                                <TextFieldWrapper label='Email' name='email'  />
                                <br></br>
                                <br></br>
                                <Password label='Password' name='password' />

                            </div>
                            <div style={{ height: 125 }}></div>

                            <Button variant="contained" color="secondary" size='large' type='submit' style={{ marginLeft: '10vw' }} >
                                LOGIN
                            </Button>
                        </Form>
                    </Formik>

                </Grid>
            </Grid>
        </div>
    )
}
