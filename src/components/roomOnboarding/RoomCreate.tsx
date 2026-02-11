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
        mt: "80px",
        minHeight: "calc(100vh - 80px)"
      }}
    >
      {/* Left — Form Area */}
      <Grid
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: { md: "center", xs: "flex-start" },
          width: { md: "45%", xs: "100%" },
          py: { md: 4, xs: 3 },
          px: { md: 6, xs: 3 },
          position: "relative"
        }}
      >
        {/* Decorative dot pattern */}
        <Grid
          className="dot-pattern"
          sx={{
            top: { md: 40 },
            left: { md: 30 },
            color: "text.secondary",
            display: { xs: "none", md: "block" },
            opacity: 0.06
          }}
        />

        <Grid
          sx={{
            width: "100%",
            maxWidth: "420px",
            animation: "fadeInUp 0.6s ease-out"
          }}
        >
          <Typography
            sx={{
              fontSize: { md: "13px", xs: "11px" },
              fontWeight: 600,
              color: "primary.main",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              mb: 1
            }}
          >
            New Room
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontSize: { md: "32px", xs: "22px" },
              fontWeight: 800,
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
              mb: 0.5
            }}
          >
            Set up your voting room
          </Typography>
          <Typography
            sx={{
              fontSize: { md: "15px", xs: "13px" },
              color: "text.secondary",
              lineHeight: 1.6,
              mb: { md: 4, xs: 3 }
            }}
          >
            Choose a name and voting system, then invite your team.
          </Typography>

          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {({ errors, touched, values, handleChange }): React.ReactNode => (
              <Grid>
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
                      error={
                        touched.votingSystem && Boolean(errors.votingSystem)
                      }
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
                      mt: 3,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                  >
                    <Button
                      sx={[
                        {
                          width: "100%",
                          fontSize: { md: "17px", xs: "15px" },
                          fontWeight: 700,
                          background: "primary.main",
                          color: (theme) =>
                            theme.palette.mode === "dark"
                              ? "#141a1f"
                              : "#ffffff",
                          py: { md: 1, xs: 0.8 },
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
      </Grid>

      {/* Right — Visual Panel */}
      <Grid
        sx={{
          width: { md: "55%", xs: "100%" },
          display: { md: "flex", xs: "none" },
          position: "relative",
          overflow: "hidden",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(232, 234, 237, 0.03)"
              : "rgba(91, 147, 217, 0.04)",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {/* Decorative circle */}
        <Grid
          sx={{
            position: "absolute",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(232, 234, 237, 0.02)"
                : "rgba(91, 147, 217, 0.04)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)"
          }}
        />
        <img
          src={letsVote}
          alt="vote"
          style={{
            maxHeight: "70vh",
            maxWidth: "90%",
            objectFit: "contain",
            borderRadius: "20px",
            position: "relative",
            zIndex: 1
          }}
        />
      </Grid>
    </Grid>
  );
}

export default RoomCreate;
