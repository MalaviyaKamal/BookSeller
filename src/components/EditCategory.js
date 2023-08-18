import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextFieldCustom from "../UI/TextField";
import { Typography, Button, Grid } from "@material-ui/core";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";

import { toast } from "react-toastify";
import categoryService from "../service/category.service";

const EditCategory = () => {
  const navigate = useNavigate();
  const initialValues = { name: "" };
  const [initialValueState, setInitialValueState] = useState(initialValues);
  const { id } = useParams();

  useEffect(() => {
    if (id) getCategoryById();
  }, [id]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Category Name is required"),
  });

  const getCategoryById = () => {
    categoryService.getById(Number(id)).then((res) => {
      setInitialValueState({
        id: res.id,
        name: res.name,
      });
    });
  };

  const onSubmit = (values) => {
    categoryService
      .save(values)
      .then((res) => {
        toast.success("successfully edited category");
        navigate("/category");
      })
      .catch((e) => toast.error("something went wrong!!"));
  };
  return (
    <>
      <Typography
        variant="h4"
        align="center"
        color="primary"
        style={{ fontWeight: "bold" }}
      ><br/>
        {id ? "Edit" : "Add"} Category
      </Typography>

      <div
        style={{
          marginTop: 20,
        }}
      >
        <Formik
          initialValues={initialValueState}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize
        >
          <Form>
            <Grid container justifyContent="space-evenly">
              <Grid container justifyContent="space-evenly">
                <Grid item xs={5}>
                  <TextFieldCustom name="name" label="Category Name" />
                </Grid>
              </Grid>
              <br />
              <br />
              <br />
              <Grid container justifyContent="space-evenly">
                <Grid item xs={5}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    style={{
                      marginRight: 100,
                    }}
                  >
                    Save
                  </Button>

                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={() => navigate("/category")}
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Form>
        </Formik>
      </div>
    </>
  );
};

export default EditCategory;
