import React, { useCallback } from "react";
import { Button, Grid, MenuItem, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { InputTextField } from "../shared/component/InputTextField";
import { IRoom } from "interfaces/Room/IRoom";
import { VotingType } from "interfaces/Room/IVotingTypes";
import letsVote from "./assets/wevote.jpg";
import Spinner from "components/shared/component/Spinner";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Room Name is required")
    .min(4, "Minimum of 4 characters"),
  votingSystem: yup.string().required("A voting system is required")
});

type Props = {
  visible?: boolean;
  isSubmitting: boolean;
  onFormSubmitted: (room: IRoom) => void;
};

function RoomCreate(props: Props) {
  const { onFormSubmitted, isSubmitting } = props;
  const roomId = uuidv4();

  const initialValues = {
    id: roomId,
    name: "",
    votingSystem: ""
  };

  const data = [
    {
      votingType: VotingType.Fibonnacci,
      text: "fibonnacci (0, 1, 2, 3, 5, 8, 13, 21, )"
    },
    { votingType: VotingType.Random, text: "random" }
  ];

  const handleSubmit = useCallback(
    (values: IRoom, formik: FormikHelpers<IRoom>) => {
      onFormSubmitted(values);
      console.log(values);

      formik.setSubmitting(false);
    },
    [onFormSubmitted]
  );

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: { md: "row", xs: "column" },
        mt: "80px"
      }}
    >
      <Grid
        sx={{
          flexDirection: "column",
          alignItems: { xs: "center" },
          width: { md: "40%", xs: "100%" },
          height: { md: "auto", xs: "50vh" },
          justifyContent: { xs: "center" }
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mt: { md: 12, xs: 15 },
            px: 6,
            fontSize: { md: "24px", xs: "18px" },
            fontWeigth: "bolder",
            textAlign: "center"
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
            <Grid sx={{ mt: 2, px: { md: 6, xs: 4 } }}>
              <Form>
                <Field
                  variant="outlined"
                  id="name"
                  name="name"
                  label="Room Name"
                  component={InputTextField}
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && Boolean(errors.name)}
                  helperText={touched.name && errors.name}
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
                        }
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
                    {data.map((type, i) => (
                      <MenuItem key={i} value={type.votingType}>
                        {type.text}
                      </MenuItem>
                    ))}
                  </Field>
                </Grid>
                <Grid
                  sx={{
                    mt: 2,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center"
                  }}
                >
                  <Button
                    sx={[
                      {
                        width: { md: "40%", xs: "70%" },
                        fontSize: { md: "24px", xs: "16px" },
                        background: "#67A3EE",
                        color: "white",
                        py: { md: 1 }
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
                    Create Room
                  </Button>
                </Grid>
                {isSubmitting && <Spinner />}
              </Form>
            </Grid>
          )}
        </Formik>
      </Grid>
      <Grid
        sx={{
          width: { md: "60%", xs: "100%" },
          background: "#67A3EE",
          height: { md: "100vh", xs: "auto" }
        }}
      >
        <Grid sx={{ display: { md: "flex", xs: "none" } }}>
          <img
            src={letsVote}
            alt="vote"
            style={{
              height: "100vh",
              width: "100%"
            }}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default RoomCreate;
