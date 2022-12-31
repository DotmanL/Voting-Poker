import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";
import { IUser } from "interfaces/User/IUser";
import { Grid } from "@mui/material";
import { IRoom } from "interfaces/Room/IRoom";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { NavBar } from "components/shared/component/NavBar";
import { userContext } from "../../App";
import VotingRoom from "./VotingRoom";
import RoomService from "../../api/RoomService";
import UserService from "../../api/UserService";
import Spinner from "components/shared/component/Spinner";
import { IUserDetails } from "interfaces/User/IUserDetails";

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = "https://votingpokerapi.herokuapp.com/";
      // url = "https://dotvoting.onrender.com";
      break;
    case "development":
    default:
      url = "http://localhost:4001";
  }

  return url;
};

const socket = io(getBaseUrl());

function VotingRoomContainer() {
  // const navigate = useNavigate();
  const getRoomId = useParams();
  const roomId = Object.values(getRoomId)[0];
  const {
    isLoading,
    error,
    data: roomData
  } = useQuery<IRoom | undefined, Error>("getRoom", async () =>
    RoomService.getRoomDetails(roomId!)
  );

  const [roomDetails, setRoomDetails] = useState<IRoom>(roomData!);
  const [votes, setVotes] = useState<IUserDetails[] | undefined>();
  const user = useContext(userContext);
  const [currentUser, setCurrentUser] = useState<IUser | null>(user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!user);

  const handleCreateUser = async (formData: IUser) => {
    await UserService.createUser(formData);
    const userByName = await UserService.getCurrentUserByName(formData.name);
    localStorage.setItem("userId", JSON.stringify(userByName?._id));
    setCurrentUser(userByName!);
    socket.emit("user", { userByName });
    setIsModalOpen(false);
    window.location.reload();
  };

  useEffect(() => {
    if (user) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
    socket.on("votesResponse", (userVotingDetails: any) => {
      setVotes(userVotingDetails);
    });
    setRoomDetails(roomData!);
  }, [user, roomData, votes]);

  if (error) {
    return <p>{(error as Error)?.message}</p>;
  }

  return (
    <Grid>
      <NavBar appName={roomDetails?.name} currentUser={currentUser!} />
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid>
          {roomDetails && (
            <VotingRoom
              room={roomDetails}
              socket={socket}
              votesCasted={votes}
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
