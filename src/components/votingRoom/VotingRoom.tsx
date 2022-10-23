import React, { useContext, useEffect, useState } from "react";
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
import { useParams } from "react-router-dom";
import { IUserDetails } from "interfaces/User/IUserDetails";

type Props = {
  room: IRoom;
  socket: any;
  votesCasted?: IVotingDetails[];
  handleCreateUser: (user: IUser) => void;
  isModalOpen: boolean;
};

function VotingRoom(props: Props) {
  const {
    room,
    socket,
    // votesCasted,
    handleCreateUser,
    isModalOpen
  } = props;
  const user = useContext(userContext);
  const [roomUsers, setRoomUsers] = useState<IUserDetails[]>([]);
  const [userVote, setUserVote] = useState<number>();
  const [isVoted, setIsVoted] = useState<boolean>();
  const getRoomId = useParams();

  useEffect(() => {
    if (room.roomId) {
      socket.emit("user", {
        name: user?.name,
        userId: user?.userId,
        socketId: socket.id,
        roomId: room.roomId,
        votedState: user?.votedState
      });
    }

    socket.on("userResponse", (data: IUserDetails[]) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].userId === user?.userId) {
          data[i].votedState = user?.votedState;
        }
      }
      setRoomUsers(data);
    });

    socket.on("isUserVotedResponse", (data: IUserDetails[]) => {
      const filteredData = data.filter(
        (d: any) => d.roomId === user?.currentRoomId
      );
      setRoomUsers(filteredData);
    });

    socket.on("isVotedResponse", (data: IUser) => {
      if (data.userId === user?.userId) {
        setIsVoted(data.votedState!);
        user!.votedState = data.votedState;
        localStorage.setItem("user", JSON.stringify(user));
      }
    });

    return () => {
      user!.votedState = false;
      localStorage.setItem("user", JSON.stringify(user));
      socket.disconnect(true);
    };
  }, [room, socket, user]);

  //TODO: JUST CHeck isVoted state here as validation
  // const handleRevealVotes = (vote: number) => {
  //     socket.emit("votes", userVote);
  // };

  const handleAddVote = (voteValue: number) => {
    if (voteValue >= 0 && user) {
      const userVotingDetails: IVotingDetails = {
        vote: voteValue,
        roomId: getRoomId.roomId!,
        sessionId: `${socket.id}${Math.random()}`,
        socketId: socket.id
      };

      user.currentVote = userVotingDetails.vote;
      user.currentRoomId = userVotingDetails.roomId;

      socket.emit("isVotedState", {
        roomId: user.currentRoomId,
        userId: user.userId,
        votedState:
          (voteValue === userVote && !isVoted) ||
          (voteValue !== userVote && true)
      });

      localStorage.setItem("user", JSON.stringify(user));
      setUserVote(user.currentVote);
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
      {/* <Grid sx={{ mt: 2, display: "none" }}>
        <Typography>{room.name}</Typography>
      </Grid> */}
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

          <Grid
            sx={{
              // background: "green",
              width: "90vw",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              mt: 2
            }}
          >
            {roomUsers?.map((roomUser: IUserDetails, i: number) => (
              <Grid key={i}>
                <Card
                  variant="outlined"
                  sx={[
                    {
                      width: { md: 80, xs: 70 },
                      height: { md: 120, xs: 100 },
                      mx: { md: 2, xs: 1 },
                      border: "1px solid #67A3EE",
                      cursor: "pointer",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: 5,
                      transition: "transform ease 300ms",
                      background:
                        roomUser.roomId === user?.currentRoomId &&
                        roomUser?.votedState!
                          ? "#67A3EE"
                          : "white"
                    },
                    {
                      "&:hover": {
                        borderRadius: "8px"
                      }
                    }
                  ]}
                >
                  {/* TODO: remove user vote value from screen */}
                  <CardContent key={i}>
                    <Typography variant="h4">
                      {roomUser.userId === user?.userId && userVote}
                    </Typography>
                  </CardContent>
                </Card>
                <Grid sx={{ mt: 1 }}>
                  <Typography variant="h4">
                    {roomUser && roomUser.name}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        sx={{
          position: "absolute" as "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderTop: "2px solid #67A3EE",
          width: { md: "100%", xs: "100vw" },
          height: { md: "200px", xs: "150px" },
          left: 0,
          right: 0,
          bottom: { md: 0, xs: 4 }
        }}
      >
        <Grid
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <VotingCard
            votingSystem={room.votingSystem}
            handleClickCard={handleAddVote}
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
