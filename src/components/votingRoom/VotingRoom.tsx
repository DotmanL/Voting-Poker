import React, { useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { userContext } from "App";
import CustomModal from "components/shared/component/CustomModal";
import { IRoom } from "interfaces/Room/IRoom";
import { IUser } from "interfaces/User/IUser";
import CreateUser from "./CreateUser";

type Props = {
  room: IRoom;
  socket: any;
  votesCasted: any;
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
  const [vote, setVotes] = useState<number>(0);

  const handleSendVotes = (e: any) => {
    e.preventDefault();
    if (isNaN(vote) === false && localStorage.getItem("user")) {
      socket.emit("votes", {
        text: vote,
        // name: currentUser?.name,
        id: `${socket.id}${Math.random()}`,
        socketID: socket.id
      });
    }
    setVotes(0);
  };

  return (
    <Grid
      sx={{
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
          <Typography>{currentUser ? currentUser.name : user?.name}</Typography>
        </Grid>
      </Grid>
      <Grid sx={{ display: "none" }}>
        <form onSubmit={handleSendVotes}>
          <input
            type="number"
            placeholder="test votes"
            name="vote"
            value={vote}
            onChange={(e) => setVotes(parseInt(e.target.value, 10) || 0)}
          />
          <button type="submit">Submit</button>
        </form>
      </Grid>
      <Grid>
        {votesCasted.map((v: any, i: number) => (
          <Grid key={i}>
            <Grid>{v.name}</Grid>
          </Grid>
        ))}
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
