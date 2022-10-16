import React, { useEffect, useState, useContext } from "react";
import { useQuery } from "react-query";
import { IUser } from "interfaces/User/IUser";
import { Grid } from "@mui/material";
import { IRoom } from "interfaces/Room/IRoom";
import { useParams } from "react-router-dom";
import { NavBar } from "components/shared/component/NavBar";
import { userContext } from "../../App";
import VotingRoom from "./VotingRoom";
import RoomService from "../../api/RoomService";
import Spinner from "components/shared/component/Spinner";
import { IVotingDetails } from "interfaces/User/IVotingDetails";

type Props = {
  socket: any;
};

function VotingRoomContainer(props: Props) {
  const { socket } = props;
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
    socket.on("votesResponse", (userVotingDetails: IVotingDetails) => {
      setVotes(userVotingDetails);
    });
    setRoomDetails(roomData!);
  }, [socket, user, roomData]);

  if (error) {
    return <p>{(error as Error)?.message}</p>;
  }

  return (
    <Grid>
      <NavBar appName={roomDetails?.name} currentUser={currentUser!} />
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
