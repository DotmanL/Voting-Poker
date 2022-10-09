import React from "react";
import { Grid } from "@mui/material";
import { NavBar } from "components/shared/component/NavBar";
import RoomCreate from "./RoomCreate";
import { IRoom } from "interfaces/Room/IRoom";
import { useNavigate } from "react-router-dom";

function RoomOnboardingContainer() {
  const navigate = useNavigate();

  const handleCreateRoom = (formData: IRoom) => {
    localStorage.setItem("room", JSON.stringify(formData));
    navigate(`/room/${formData.id}}`);
    console.log("room created");
  };
  return (
    <Grid>
      <NavBar appName="Dot Voting" />
      <RoomCreate isSubmitting={false} onFormSubmitted={handleCreateRoom} />
    </Grid>
  );
}

export default RoomOnboardingContainer;
