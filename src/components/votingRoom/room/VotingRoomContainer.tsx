import { Grid } from "@mui/material";
import RoomService from "api/RoomService";
import UserService from "api/UserService";
import { NavBar } from "components/shared/component/NavBar";
import Spinner from "components/shared/component/Spinner";
import { IRoom } from "interfaces/Room/IRoom";
import { IUser } from "interfaces/User/IUser";
import { useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { UserContext } from "utility/providers/UserProvider";
import VotingRoom from "./VotingRoom";

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = "https://votingpokerapi.herokuapp.com/";
      break;
    case "development":
    default:
      url = "http://localhost:4001";
  }

  return url;
};

type RoomRouteParams = {
  roomId: string;
};
const socket = io(getBaseUrl());

function VotingRoomContainer() {
  const { roomId } = useParams<RoomRouteParams>();
  const currentUrl = window.location.href;
  const {
    isLoading,
    error,
    data: roomData
  } = useQuery<IRoom | undefined, Error>("getRoom", async () =>
    RoomService.getRoomDetails(roomId!)
  );

  const { currentUser } = useContext(UserContext);
  const [roomDetails, setRoomDetails] = useState<IRoom>(roomData!);
  const [loggedInUser, setLoggedInUser] = useState<IUser | undefined>(
    currentUser
  );
  const [isModalOpen, setIsModalOpen] = useState<boolean>(
    !currentUser ? true : false
  );

  const handleCreateUser = async (formData: IUser) => {
    const response = await UserService.createUser(formData);
    if (response) {
      const user = await UserService.getCurrentUser(response.data._id!);
      if (!user) {
        return;
      }
      localStorage.setItem("userId", JSON.stringify(user?._id));
      setLoggedInUser(user!);
      socket.emit("user", { user });
      window.location.reload();
      setIsModalOpen(false);
    }
    // else {
    //   toast.error(
    //     "User with the same user name already exists, please pick another user name"
    //   );
    // }
  };

  useEffect(() => {
    if (!!currentUser) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }

    setRoomDetails(roomData!);
  }, [currentUser, roomData]);

  if (error) {
    return <p>{(error as Error)?.message}</p>;
  }

  return (
    <Grid
      sx={{
        height: "100%",
        backgroundColor: "secondary.main"
      }}
    >
      <NavBar
        appName={roomDetails?.name}
        isBorderBottom={false}
        loggedInUser={loggedInUser!}
        currentRoomLink={currentUrl}
        companyName={roomDetails?.companyName}
      />
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid
          sx={{
            height: "100%"
          }}
        >
          {roomDetails && (
            <VotingRoom
              room={roomDetails}
              socket={socket}
              handleCreateUser={handleCreateUser}
              isModalOpen={isModalOpen}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default VotingRoomContainer;
