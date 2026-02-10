import React, { useCallback } from "react";
import { Button, Grid, MenuItem, Typography } from "@mui/material";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { Formik, Form, Field, FormikHelpers } from "formik";
import { InputTextField } from "../shared/component/InputTextField";
import { IRoom } from "interfaces/Room/IRoom";
import CircularProgress from "@mui/material/CircularProgress";
import letsVote from "./assets/letsvote.jpg";
import { votingTypeData } from "api/VotingTypesData";
import RoomsTable from "./RoomsTable";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Room Name is required")
    .min(4, "Minimum of 4 characters"),
  votingSystem: yup.number().required("A voting system is required")
});

type Props = {
  visible?: boolean;
  isSubmitting: boolean;
  onFormSubmitted: (room: IRoom) => void;
  isRoomsTableVisible: boolean;
  allRooms: IRoom[];
};

function RoomCreate(props: Props) {
  const { onFormSubmitted, isSubmitting, allRooms, isRoomsTableVisible } =
    props;
  const roomId = uuidv4();

  const initialValues = {
    roomId: roomId,
    name: "",
    votingSystem: 1
  };

  const handleSubmit = useCallback(
    (values: IRoom, formik: FormikHelpers<IRoom>) => {
      onFormSubmitted(values);
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
          height: { md: "auto", xs: "auto" },
          justifyContent: { xs: "center" }
        }}
      >
        <Typography
          variant="h4"
          sx={{
            mt: {
              md: !isRoomsTableVisible ? "45%" : 12,
              xs: !isRoomsTableVisible ? "50%" : 5
            },
            px: 6,
            fontSize: { md: "22px", xs: "18px" },
            fontWeight: 600,
            letterSpacing: "-0.01em",
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
                    {votingTypeData.map((type, i) => (
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
                        fontSize: { md: "20px", xs: "16px" },
                        fontWeight: 600,
                        background: "primary.main",
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "#141a1f" : "#ffffff",
                        py: { md: 0.5 },
                        borderRadius: "12px"
                      },
                      {
                        "&:hover": {
                          transform: "translateY(-1px)",
                          boxShadow: "0 4px 16px rgba(91, 147, 217, 0.3)"
                        }
                      }
                    ]}
                    type="submit"
                    disabled={isSubmitting}
                    variant="contained"
                  >
                    {isSubmitting ? (
                      <CircularProgress size={24} sx={{ ml: 2 }} />
                    ) : (
                      "Create Room"
                    )}
                  </Button>
                </Grid>
              </Form>

              {isRoomsTableVisible && (
                <Grid sx={{ mt: 5, mb: { xs: 3 } }}>
                  <RoomsTable allRooms={allRooms} />
                </Grid>
              )}
            </Grid>
          )}
        </Formik>
      </Grid>
      <Grid
        sx={{
          width: { md: "60%", xs: "100%" },
          background: (theme) => theme.palette.primary.main,
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
