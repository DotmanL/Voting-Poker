import React, { useState } from "react";
import { Grid } from "@mui/material";
import { NavBar } from "components/shared/component/NavBar";
import RoomCreate from "./RoomCreate";
import { IRoom } from "interfaces/Room/IRoom";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import { RoomService } from "../../api/RoomService";
import Spinner from "components/shared/component/Spinner";

function RoomOnboardingContainer() {
  const navigate = useNavigate();
  const {
    isLoading: isRoomsLoading,
    error,
    data: allRooms
  } = useQuery<IRoom[] | undefined, Error>("getRooms", async () =>
    RoomService.getRooms()
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (formData: IRoom) => {
    localStorage.setItem("room", JSON.stringify(formData));
    setIsLoading(true);
    await RoomService.createRoom(formData);
    setIsLoading(false);
    navigate(`/room/${formData.roomId}`);
  };

  if (error) {
    return <p>{(error as Error)?.message}</p>;
  }

  return (
    <Grid>
      <NavBar appName="Dot Voting" isBorderBottom />
      <Grid>
        {isRoomsLoading ? (
          <Spinner />
        ) : (
          <Grid>
            {allRooms && (
              <RoomCreate
                isSubmitting={isLoading}
                onFormSubmitted={handleCreateRoom}
                allRooms={allRooms}
              />
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default RoomOnboardingContainer;
