import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";
import { IUser } from "interfaces/User/IUser";
import { Grid } from "@mui/material";
import { IRoom } from "interfaces/Room/IRoom";
import { useParams } from "react-router-dom";
import { NavBar } from "components/shared/component/NavBar";
import { userContext } from "../../App";
import { io } from "socket.io-client";
import VotingRoom from "./VotingRoom";
import RoomService from "../../api/RoomService";
import Spinner from "components/shared/component/Spinner";

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = "https://dotvoting.onrender.com";
      break;
    case "development":
    default:
      url = "http://localhost:4000";
  }

  return url;
};

const socket = io(getBaseUrl());

console.log(socket);

function VotingRoomContainer() {
  // const navigate = useNavigate();
  const getRoomId = useParams();
  const roomId = Object.values(getRoomId)[0];
  const { isLoading, error, data } = useQuery<IRoom | undefined, Error>(
    "getRoom",
    async () => RoomService.getRoomDetails(roomId!)
  );
  const [roomDetails, setRoomDetails] = useState<IRoom>(data!);

  const [votes, setVotes] = useState<any>([]);
  const user = useContext(userContext);
  const [currentUser, setCurrentUser] = useState<IUser | null>(user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!user);

  const handleCreateUser = (formData: IUser) => {
    localStorage.setItem("user", JSON.stringify(formData));
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user!);
    setCurrentUser(userData);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (user) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
    const res = socket.on("votesResponse", (data) =>
      setVotes([...votes, data])
    );
    console.log(res);
    setRoomDetails(data!);
  }, [votes, user, data]);

  if (error) {
    return <p>{(error as Error)?.message}</p>;
  }

  return (
    <Grid>
      <NavBar appName={roomDetails?.name!} currentUser={currentUser!} />
      {isLoading ? (
        <Spinner />
      ) : (
        <Grid sx={{ mt: 8 }}>
          {roomDetails && (
            <VotingRoom
              room={roomDetails}
              socket={socket}
              votesCasted={votes}
              handleCreateUser={handleCreateUser}
              isModalOpen={isModalOpen}
              currentUser={currentUser!}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default VotingRoomContainer;
