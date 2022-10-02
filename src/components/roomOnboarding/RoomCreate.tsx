import React, { useCallback } from "react";
import { Grid, MenuItem, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { InputTextField } from "../shared/component/InputTextField";
import { IRoom } from "interfaces/Room/IRoom";

const validationSchema = yup.object().shape({
  roomName: yup
    .string()
    .required("Room Name is required")
    .min(4, "Minimum of 4 characters"),
  votingSystem: yup.string().required()
});

type Props = {
  visible?: boolean;
  isSubmitting?: boolean;
  onFormSubmitted?: (room: IRoom) => void;
};

function RoomCreate(props: Props) {
  const { onFormSubmitted } = props;
  const id = uuidv4();
  console.log(id);

  const initialValues = {
    roomName: "",
    votingSystem: ""
  };

  const data = [
    { type: { votingSystemType: "fibonnacci (0, 1, 2, 3, 5, 8, 13, 21, )" } },
    { type: { votingSystemType: "random" } }
  ];

  const handleSubmit = useCallback(
    (values: IRoom, formik: FormikHelpers<IRoom>) => {
      onFormSubmitted && onFormSubmitted(values);
      formik.setSubmitting(false);
    },
    [onFormSubmitted]
  );

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "row",
        mt: "80px"
      }}
    >
      <Grid sx={{ width: "40%" }}>
        <Typography
          variant="h4"
          sx={{
            mt: 20,
            px: 6,
            fontSize: "24px",
            fontWeigth: "bolder"
          }}
        >
          Choose a name and voting system for your poll
        </Typography>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          {({ errors, touched, values, handleChange }): React.ReactNode => (
            <Grid sx={{ mt: 2, px: 6 }}>
              <Form>
                <Field
                  variant="outlined"
                  id="roomName"
                  name="roomName"
                  label="Room Name"
                  component={InputTextField}
                  value={values.roomName}
                  onChange={handleChange}
                  error={touched.roomName && Boolean(errors.roomName)}
                  helperText={touched.roomName && errors.roomName}
                />
                <Grid sx={{ mt: 2 }}>
                  <Field
                    variant="outlined"
                    select
                    SelectProps={{
                      MenuProps: {
                        anchorOrigin: {
                          vertical: "bottom",
                          horizontal: "left"
                        },
                        transformOrigin: {
                          vertical: "top",
                          horizontal: "left"
                        },
                        getContentAnchorEl: null
                      }
                    }}
                    id="votingSystem"
                    name="votingSystem"
                    label="Choose a voting system"
                    component={InputTextField}
                    value={values.votingSystem}
                    onChange={handleChange}
                    error={touched.votingSystem && Boolean(errors.votingSystem)}
                    helperText={touched.votingSystem && errors.votingSystem}
                  >
                    {data.map((types, i) => (
                      <MenuItem key={i} value={types.type.votingSystemType}>
                        {types.type.votingSystemType}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
              </Form>
            </Grid>
          )}
        </Formik>
      </Grid>
      <Grid sx={{ width: "60%", background: "#67A3EE", height: "100vh" }}>
        <Grid sx={{ mt: 10 }}>PICTURE</Grid>
      </Grid>
    </Grid>
  );
}

export default RoomCreate;
