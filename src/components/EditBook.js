import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextFieldCustom from "../UI/TextField";
import Select from "../UI/Select";
import { Typography,Button, Grid } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import bookService from "../service/book.service";
import { Formik, Form } from "formik";

import { toast } from "react-toastify";
import categoryService from "../service/category.service";




const EditBook = () => {
  let upload = React.useRef(null);
  const navigate = useNavigate();
  const initialValues = {
    name: "",
    price: "",
    categoryId: 0,
    description: "",
    base64image: "",
  };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();
  const [categories, setCategories] = useState([]);

  const getBookById = () => {
    bookService.getById(Number(id)).then((res) => {
      console.log("book found ", res);
      setInitialValueState({
        id: res.id,
        name: res.name,
        price: res.price,
        categoryId: res.categoryId,
        description: res.description,
        base64image: res.base64image,
      });
    });
  };

  useEffect(() => {
    if (id) getBookById();
    categoryService.getAll().then((res) => {
      setCategories(res);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Book Name is required"),
    description: Yup.string().required("Description is required"),
    categoryId: Yup.number()
      .min(2, "Category is required")
      .required("Category is required"),
    price: Yup.number().required("Price is required"),
    base64image: Yup.string().required("Image is required"),
  });

  const onSubmit = (values) => {
   console.log("SAVE ME  ",values);
    bookService
      .save(values)
      .then((res) => {
        toast.success(
          values.id
            ? "Record saved successfully"
            : "Record created successfully"
        );
        navigate("/product");
      }).catch((e) => toast.error("something went wrong.."));
  };

  const onSelectFile = (e, setFieldValue, setFieldError) => {
    const files = e.target.files;
    if (files?.length) {
      const fileSelected = e.target.files[0];
      const fileNameArray = fileSelected.name.split(".");
      const extension = fileNameArray.pop();
      if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
        if (fileSelected.size > 50000) {
          toast.error("File size must be less then 50KB");
          return;
        }
        const reader = new FileReader();
        reader.readAsDataURL(fileSelected);
        reader.onload = function () {
          setFieldValue("base64image", reader.result);
        };
        reader.onerror = function (error) {
          throw error;
        };
      } else {
        toast.error("only jpg,jpeg and png files are allowed");
      }
    } else {
      setFieldValue("base64image", "");
    }
  };

  return (
    <>
      <Typography variant="h4" align="center" color="primary" style={{fontWeight:'bold'}}>
        <br/>
        {id ? "Edit" : "Add"} Book
      </Typography>

      <div
        style={{
         //  border: "1px solid black",
          marginTop:20
        }}
      >
        <Formik
          //   validateOnChange='true'
          
          initialValues={initialValueState}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
         {({ errors,values, touched, setFieldValue,handleBlur,setFieldError }) => (
          <Form >
            <Grid container justifyContent="space-evenly">
              <Grid item xs={5}>
                <TextFieldCustom name="name" label="Book Name" />
              </Grid>
              <Grid item xs={5}>
                <TextFieldCustom name="price" label="Book Price" />
              </Grid>
            </Grid>
            <br></br>
            <br></br>

            <Grid container justifyContent="space-evenly">
              <Grid item xs={5}>
                <Select name="categoryId" options={categories} label="Roles" />
              </Grid>
              <Grid item xs={5}>
                {/* <TextFieldCustom name='email' defaultValue={"mnkj"} label="email" /> */}
                <div className="form-col">
                  {!values.base64image && (
                    <>
                      
                        <input
                          id="contained-button-file"
                          type="file"
                          ref={upload}
                          onBlur={handleBlur}
                          hidden
                          onChange={(e) => {
                            onSelectFile(e, setFieldValue, setFieldError);
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={()=>upload.current.click()}
                        >
                          Upload Image
                        </Button>
                      
                    </>
                  )}
                  {values.base64image&& (
                    <div className="uploaded-file-name">
                      <em>
                        <img src={values.base64image} alt="" style={{
                           width:'100px',

                        }}/>
                      </em>
                      {/* image{" "} */}
                      <span
                        onClick={() => {
                          setFieldValue("base64image", "");
                        }}
                        style={{
                           fontSize:20,
                           cursor:'pointer',
                           position:'relative',
                           top:-60,
                        }}
                      >
                        x
                      </span>
                    </div>
                  )}
                </div>
              </Grid>
            </Grid>
            <br></br>
            <br></br>

            <Grid container>
              <Grid item xs={11} style={{ marginLeft: "5.55vw" }}>
                <TextFieldCustom
                  name="description"
                  label="description"
                  variant="outlined"
                />
              </Grid>
            </Grid>
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
                  onClick={() => navigate("/product")}
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

export default EditBook;
