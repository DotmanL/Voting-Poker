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
  const [votes, setVotes] = useState<any[]>([]);
  const user = useContext(userContext);
  const [currentUser, setCurrentUser] = useState<IUser | null>(user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!!user);

  const handleCreateUser = (formData: IUser) => {
    localStorage.setItem("user", JSON.stringify(formData));
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user!);
    setCurrentUser(userData);
    socket.emit("user", { userData });
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
      console.log(userVotingDetails);

      setVotes([userVotingDetails]);
      console.log(votes);
    });
    setRoomDetails(roomData!);
  }, [socket, user, roomData, votes]);

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
