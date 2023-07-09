import React, { useState } from "react";
import { Grid } from "@mui/material";
import { NavBar } from "components/shared/component/NavBar";
import RoomCreate from "./RoomCreate";
import { IRoom } from "interfaces/Room/IRoom";
import { useQuery } from "react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { RoomService } from "../../api/RoomService";
import Spinner from "components/shared/component/Spinner";

type Props = {
  isRoomsTableVisible?: boolean;
};

function RoomOnboardingContainer(props: Props) {
  const { isRoomsTableVisible = false } = props;
  const navigate = useNavigate();
  const location = useLocation();
  const companyName = location.pathname.slice(1);

  const {
    isLoading: isRoomsLoading,
    error,
    data: allRooms
  } = useQuery<IRoom[] | undefined, Error>("getRooms", async () =>
    RoomService.getRooms(companyName)
  );

  const [isLoading, setIsLoading] = useState(false);

  const handleCreateRoom = async (formData: IRoom) => {
    if (companyName) {
      formData.companyName = companyName;
    }
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
    <Grid
      sx={{
        backgroundColor: "secondary.main"
      }}
    >
      <NavBar
        appName="Virtual Planning Poker"
        companyName={companyName}
        isBorderBottom
      />
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
                isRoomsTableVisible={isRoomsTableVisible}
              />
            )}
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default RoomOnboardingContainer;
