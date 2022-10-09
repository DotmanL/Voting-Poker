import React, { useCallback, useEffect, useState } from "react";
import { Grid } from "@mui/material";
import { IRoom } from "interfaces/Room/IRoom";
import { useNavigate } from "react-router-dom";
import { NavBar } from "components/shared/component/NavBar";
import { io } from "socket.io-client";
import VotingRoom from "./VotingRoom";

const socket = io("http://localhost:4000");

console.log(socket);

function VotingRoomContainer() {
  const navigate = useNavigate();
  const [roomDetails, setRoomDetails] = useState<IRoom>();
  const [votes, setVotes] = useState<any>([]);

  const getRoomDetails = useCallback(() => {
    const room = localStorage.getItem("room");

    //TODO: updted to check for if not user id stored
    if (!room) {
      navigate("/new-room");
    }
    const roomData = JSON.parse(room!);
    setRoomDetails(roomData);
    return roomData;
  }, [navigate]);

  useEffect(() => {
    const res = socket.on("votesResponse", (data) =>
      setVotes([...votes, data])
    );
    console.log(res);

    getRoomDetails();
  }, [getRoomDetails, votes]);

  console.log(votes);

  return (
    <Grid>
      <NavBar appName={roomDetails?.name!} />
      {roomDetails && (
        <Grid sx={{ mt: 8 }}>
          <VotingRoom room={roomDetails} socket={socket} votesCasted={votes} />
        </Grid>
      )}
    </Grid>
  );
}

export default VotingRoomContainer;
