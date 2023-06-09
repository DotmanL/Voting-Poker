import React, { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { InputTextField } from "components/shared/component/InputTextField";
import Spinner from "components/shared/component/Spinner";
import { IUser } from "interfaces/User/IUser";

type Props = {
  visible?: boolean;
  isSubmitting: boolean;
  onFormSubmitted: (user: IUser) => void;
};

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("User Name is required")
    .min(3, "Minimum of 3 characters")
});

function CreateUser(props: Props) {
  const { onFormSubmitted, isSubmitting } = props;
  const userId = uuidv4();

  const initialValues = {
    userId: userId,
    name: ""
  };

  const handleSubmit = useCallback(
    (values: IUser, formik: FormikHelpers<IUser>) => {
      onFormSubmitted(values);
      formik.setSubmitting(false);
    },
    [onFormSubmitted]
  );

  return (
    <Grid sx={{ px: 4, py: { md: 2, xs: 1 }, mt: { md: 4, xs: 2 } }}>
      <Typography
        sx={{ mb: { md: 1 }, fontSize: { md: "32px" }, fontWeight: 500 }}
      >
        Create Name
      </Typography>
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
      >
        {({ errors, touched, values, handleChange }): React.ReactNode => (
          <Grid sx={{ mt: { md: 2, xs: 2 } }}>
            <Form>
              <Field
                variant="outlined"
                id="name"
                name="name"
                label="User Name"
                component={InputTextField}
                value={values.name}
                onChange={handleChange}
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
              />
              <Grid
                sx={{
                  mt: 2,
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  px: { md: 10 },
                  mb: { xs: 2 }
                }}
              >
                <Button
                  sx={[
                    {
                      width: { md: "100%", xs: "100%" },
                      height: { md: "auto", xs: "auto" },
                      px: { md: 2, xs: 1 },
                      fontSize: { md: "24px", xs: "16px" },
                      background: "primary.main",
                      color: "secondary.main"
                    },
                    {
                      "&:hover": {
                        color: "white",
                        backgroundColor: "green"
                      }
                    }
                  ]}
                  type="submit"
                  disabled={isSubmitting}
                  variant="contained"
                >
                  Continue to room
                </Button>
              </Grid>
              {isSubmitting && <Spinner />}
            </Form>
          </Grid>
        )}
      </Formik>
    </Grid>
  );
}

export default CreateUser;
