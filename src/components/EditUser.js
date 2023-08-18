import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextFieldCustom from "../UI/TextField";
import Select from "../UI/Select";
import { Typography,Button, Grid } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";

import { toast } from "react-toastify";
import categoryService from "../service/category.service";
import userService from "../service/user.service";




const EditUser = () => {
  const navigate = useNavigate();
  const initialValues = {
    id: 0,
    firstName: '',
    lastName:'',
    email: '',
    roleId: 3
}
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();
  const roles= [{id:1,name:'admin'},{id:2,name:'seller'},{id:3,name:'buyer'}]


  useEffect(() => {
    if (id) {
        userService.getById(Number(id)).then((res) => {
            if (res) {
              setInitialValueState({
                id: res.id,
                ...res
              });

            }
          });
    }
  }, [id]);

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().min(3, "First Name Must be 3 characters long...").max(10).trim('The firstName cannot include leading and trailing spaces').required("Please Enter Your First Name"),
    lastName: Yup.string().min(3, "Last Name must be 3 characters long...").max(10).trim('The lastName cannot include leading and trailing spaces').required('Please Enter Your Last Name'),
    email: Yup.string().email("Please Enter Valid Email").trim('The email cannot include leading and trailing spaces').required('please Enter your Email ID'),
    roleId: Yup.number().required("Role ID is required")
});

  const onSubmit = (values) => {
      const updatedValue = {
          ...values,
          role: roles.find((r) => r.id === values.roleId).name,
        };
        delete updatedValue._id;
        delete updatedValue.__v;
        console.log("save me....",updatedValue);
     userService
     .update(updatedValue)
     .then((res) => {
       if (res) {
         toast.success("User Role Updated Successfully");
         navigate("/users");
       }
     })
  };

  return (
    <>
      <Typography variant="h4" align="center" color="primary" style={{fontWeight:'bold'}}>
        <br/>
        Edit User
      </Typography>

      <div
        style={{
          marginTop:20
        }}
      >
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
         {({ errors,values, touched, setFieldValue,handleBlur,setFieldError }) => (
          <Form >
            <Grid container justifyContent="space-evenly">
              <Grid item xs={5}>
                <TextFieldCustom name="firstName" label="First Name" />
              </Grid>
              <Grid item xs={5}>
                <TextFieldCustom name="lastName" label="Last Name" />
              </Grid>
            </Grid>
            <br></br>
            <br></br>

            <Grid container justifyContent="space-evenly">
              <Grid item xs={5}>
                <Select name="roleId" options={roles} label="Roles" />
              </Grid>
              <Grid item xs={5}>
                <TextFieldCustom name="email" label="Email" />
              </Grid>
              
            </Grid>
            <br></br>
            <br></br>

        
            <Grid container justifyContent="space-evenly">
              <Grid item xs={5}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Save
                </Button>
              </Grid>
              <Grid item xs={5}>
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </Form>)
          }
        </Formik>
      </div>
    </>
  );
};

export default EditUser;
