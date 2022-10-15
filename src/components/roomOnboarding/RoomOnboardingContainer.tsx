import React, { useState } from "react";
import { Grid } from "@mui/material";
import { NavBar } from "components/shared/component/NavBar";
import RoomCreate from "./RoomCreate";
import { IRoom } from "interfaces/Room/IRoom";
import { useNavigate } from "react-router-dom";
import { RoomService } from "../../api/RoomService";

function RoomOnboardingContainer() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (formData: IRoom) => {
    localStorage.setItem("room", JSON.stringify(formData));
    setIsLoading(true);
    await RoomService.createRoom(formData);
    setIsLoading(false);
    navigate(`/room/${formData.id}`);
  };
  return (
    <Grid>
      <NavBar appName="Dot Voting" />
      <RoomCreate isSubmitting={isLoading} onFormSubmitted={handleCreateRoom} />
    </Grid>
  );
}

export default RoomOnboardingContainer;
