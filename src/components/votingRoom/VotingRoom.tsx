import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { userContext } from "App";
import CustomModal from "components/shared/component/CustomModal";
import { IRoom } from "interfaces/Room/IRoom";
import { IUser } from "interfaces/User/IUser";
import CreateUser from "./CreateUser";
import { IVotingDetails } from "interfaces/User/IVotingDetails";
import VotingCard from "./VotingCard";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

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

  const handleSendVotes = (vote: number) => {
    const getRoomId = localStorage.getItem("room");
    const roomDetails = JSON.parse(getRoomId!);
    if (vote && user) {
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
              mt: "30vh",
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
              <Card
                key={votesCasted.sessionId}
                variant="outlined"
                sx={[
                  {
                    minWidth: { md: 80, xs: 70 },
                    minHeight: { md: 120, xs: 100 },
                    mx: { md: 2, xs: 1 },
                    border: "1px solid #67A3EE",
                    cursor: "pointer",
                    borderRadius: "8px",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    boxShadow: 5,
                    transition: "transform ease 300ms"
                  },
                  {
                    "&:hover": {
                      borderRadius: "8px"
                      // opacity: "0.9",
                      // transform: "translate(0, -20px)"
                    }
                  }
                ]}
              >
                <CardContent>
                  <Typography variant="h4">{votesCasted.vote}</Typography>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#67A3EE",
          border: "1px dashed #67A3EE",
          width: { md: "100%", xs: "100vw" },
          height: { md: "200px", xs: "150px" },
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <Grid sx={{ height: "100%" }}>
          <VotingCard
            votingSystem={room.votingSystem}
            handleClickCard={handleSendVotes}
          />
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
