import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { userContext } from "App";
import CustomModal from "components/shared/component/CustomModal";
import { IRoom } from "interfaces/Room/IRoom";
import { IUser } from "interfaces/User/IUser";
import CreateUser from "./CreateUser";
import { IVotingDetails } from "interfaces/User/IVotingDetails";
import VotingCard from "./VotingCard";

type Props = {
  room: IRoom;
  socket: any;
  votesCasted: IVotingDetails;
  currentUser: IUser;
  handleCreateUser: (user: IUser) => void;
  isModalOpen: boolean;
};

function VotingRoom(props: Props) {
  const {
    room,
    socket,
    votesCasted,
    handleCreateUser,
    isModalOpen,
    currentUser
  } = props;
  const user = useContext(userContext);
  const [vote, setVotes] = useState<string>("");

  const handleSendVotes = (e: any) => {
    e.preventDefault();
    const getRoomId = localStorage.getItem("room");
    const roomDetails = JSON.parse(getRoomId!);
    const voteValue = parseInt(vote.toString(), 10);
    if (isNaN(voteValue) === false && user) {
      const userVotingDetails: IVotingDetails = {
        vote: vote,
        userId: user.userId,
        userName: user.name,
        roomId: roomDetails.id,
        sessionId: `${socket.id}${Math.random()}`,
        socketId: socket.id
      };
      socket.emit("votes", userVotingDetails);
      localStorage.setItem("userVotes", JSON.stringify(userVotingDetails));
    }

    setVotes("");
  };

  return (
    <Grid
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "row",
        height: "100vh"
      }}
    >
      <Grid sx={{ mt: 2, display: "none" }}>
        <Typography>{room.name}</Typography>
      </Grid>
      <Grid
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          mr: "auto",
          ml: "auto"
        }}
      >
        <Grid
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "center"
          }}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              mt: "25vh",
              borderRadius: "20px",
              border: "2px solid #67A3EE",
              width: { md: "400px", xs: "200px" },
              height: { md: "200px", xs: "100px" }
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontSize: { md: "32px", xs: "16px" } }}
            >
              Pick Your Cards
            </Typography>
          </Grid>
          <Grid sx={{ mt: 4 }}>
            <Typography>
              {currentUser ? currentUser.name : user?.name}
            </Typography>
          </Grid>
          <Grid>
            {votesCasted && (
              <Grid key={votesCasted.sessionId}>
                <Grid>{votesCasted.vote}</Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: "#4BA3C3",
          border: "1px dashed #67A3EE",
          width: "100%",
          height: "350px",
          left: 0,
          right: 0,
          bottom: 0,
          px: 4
        }}
      >
        <Grid sx={{ mt: 4 }}>
          <form onSubmit={handleSendVotes}>
            <input
              type="text"
              placeholder="Enter your votes"
              name="vote"
              value={vote}
              onChange={(e) => setVotes(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </Grid>
        <Grid>
          <VotingCard votingSystem={room.votingSystem} />
        </Grid>
      </Grid>

      <CustomModal isOpen={isModalOpen}>
        <Grid>
          <CreateUser isSubmitting={false} onFormSubmitted={handleCreateUser} />
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default VotingRoom;
