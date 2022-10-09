import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomModal from "components/shared/component/CustomModal";
import { IRoom } from "interfaces/Room/IRoom";
import { IUser } from "interfaces/User/IUser";
import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import CreateUser from "./CreateUser";

type Props = {
  room: IRoom;
  socket: any;
  votesCasted: any;
};

function VotingRoom(props: Props) {
  const { room, socket, votesCasted } = props;
  const user = useContext(userContext);
  const [currentUser, setCurrentUser] = useState<IUser | null>(user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!user);
  const [vote, setVotes] = useState<number>(0);

  const handleCreateUser = (formData: IUser) => {
    localStorage.setItem("user", JSON.stringify(formData));
    const user = localStorage.getItem("user");
    const userData = JSON.parse(user!);
    setCurrentUser(userData);
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (currentUser) {
      setIsModalOpen(false);
    }
  }, [currentUser]);

  const handleSendVotes = (e: any) => {
    e.preventDefault();
    if (isNaN(vote) === false && localStorage.getItem("user")) {
      socket.emit("votes", {
        text: vote,
        name: currentUser?.name,
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
      <Grid sx={{ mt: 2 }}>
        <Typography>{room.name}</Typography>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          mr: "auto",
          ml: "auto",
          mt: "auto",
          mb: "auto",
          borderRadius: "20px",
          bgcolor: "background.paper",
          border: "2px solid #67A3EE",
          width: { md: "500px", xs: "200px" },
          height: { md: "300px", xs: "100px" }
        }}
      >
        <Typography variant="h3" sx={{ fontSize: { md: "32px", xs: "16px" } }}>
          Pick Your Cards
        </Typography>
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
            <CreateUser
              isSubmitting={false}
              onFormSubmitted={handleCreateUser}
            />
          </Grid>
        </CustomModal>
      </Grid>
    </Grid>
  );
}

export default VotingRoom;
