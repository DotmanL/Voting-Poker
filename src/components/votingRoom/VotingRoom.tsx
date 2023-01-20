import React, { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { userContext } from "App";
import VotingResult from "./VotingResult";
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
import Slide from "@mui/material/Slide";
import { toast } from "react-toastify";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import UserService from "api/UserService";

const useStyles = makeStyles((theme) => ({
  "@keyframes glowing": {
    from: {
      boxShadow: "0px 0px 10px 3px #67a3ee"
    },
    to: {
      boxShadow: "0px 0px 20px 5px #67a3ee"
    }
  },

  pickCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30vh",
    borderRadius: "20px",
    border: "2px solid #67A3EE",
    width: "400px",
    height: "200px",
    [theme.breakpoints.down("md")]: {
      width: "300px",
      height: "150px"
    }
  },

  glowingCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "30vh",
    borderRadius: "20px",
    animation: `$glowing 0.5s infinite alternate`,
    width: "400px",
    height: "200px",
    [theme.breakpoints.down("md")]: {
      width: "300px",
      height: "150px"
    }
  }
}));

type Props = {
  room: IRoom;
  socket: any;
  votesCasted?: IUserDetails[];
  handleCreateUser: (user: IUser) => void;
  isModalOpen: boolean;
};

function VotingRoom(props: Props) {
  const { room, socket, votesCasted, handleCreateUser, isModalOpen } = props;
  const classes = useStyles();
  const user = useContext(userContext);
  const [roomUsers, setRoomUsers] = useState<IUserDetails[]>();
  const [userVote, setUserVote] = useState<number | undefined>();
  // const [isDisabled, setIsDisabled]= useState<boolean>()
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const getRoomId = useParams();
  const getUserId = localStorage.getItem("userId");
  const userId = JSON.parse(getUserId!);

  useEffect(() => {
    socket.emit("user", {
      name: user?.name,
      _id: user?._id,
      socketId: socket.id && socket.id,
      roomId: room.roomId,
      votedState: user?.votedState,
      currentVote: user?.currentVote
    });

    socket.on("userResponse", async (data: IUserDetails[]) => {
      const userResponse = () => {
        const getRoomOnlyData = data.filter((d) => d.roomId === room.roomId);
        return getRoomOnlyData;
      };
      if (!user) {
        return;
      }
      const roomData = userResponse();
      setRoomUsers(roomData);
    });

    socket.on("welcome", (data: any) => {
      const welcomeMessage = ` Hi ${user && user.name}, welcome to ${
        room.name
      } room`;
      if (data.userId === user!._id) {
        toast.success(welcomeMessage, { autoClose: 2500, pauseOnHover: true });
      }
    });

    socket.on("isUserVotedResponse", (data: IUserDetails[]) => {
      const getRoomOnlyData = data.find(
        (d) => d.roomId === room.roomId && d._id === user?._id
      );

      //Checks if our data contains any user in the room where a vote update was done
      if (!!getRoomOnlyData) {
        setRoomUsers(data);
      }
    });

    socket.on("isVotedResponse", (data: IUser) => {
      if (data._id === user?._id) {
        setIsVoted(data.votedState!);
        user!.votedState = data.votedState;
      }
    });

    return () => {
      // too many queries on DB, ignore isConnected boolean now as it of no use currently
      // const disconnectUser = async () => {
      //   user!.isConnected = false;
      //   await UserService.updateUser(user!._id!, user!);
      // };
      // disconnectUser();
      socket.disconnect();
    };
  }, [room, socket, user]);

  const isDisabled = () => {
    if (!roomUsers) {
      return true;
    }
    return roomUsers.filter((ru) => ru.votedState === true).length <
      roomUsers!.length
      ? true
      : false;
  };

  const handleRevealVotes = () => {
    const roomUsersVotes = roomUsers;
    socket.emit("votes", { allVotes: roomUsersVotes, roomId: room.roomId });
  };

  const handleNewVotingSession = async () => {
    roomUsers?.forEach((ru) => {
      ru.votedState = false;
      ru.currentVote = undefined;
    });
    user!.votedState = false;
    user!.currentVote = undefined;
    const currentRoomUsers = await UserService.getRoomUsers(room.roomId);
    for (const currentRoomUser of currentRoomUsers!) {
      currentRoomUser.votedState = false;
      currentRoomUser.currentVote = undefined;
      await UserService.resetVote(currentRoomUser!._id!);
    }
    setUserVote(undefined);
    const updatedCurrentRoomUsers = await UserService.getRoomUsers(room.roomId);
    setRoomUsers(updatedCurrentRoomUsers!);
    socket.emit("votes", { allVotes: false, roomId: room.roomId });
    socket.emit("isUserVoted", roomUsers);
  };

  const handleAddVote = async (voteValue: number) => {
    if (voteValue >= 0 && user) {
      const userVotingDetails: IVotingDetails = {
        vote: voteValue,
        roomId: getRoomId.roomId!,
        sessionId: `${socket.id}${Math.random()}`,
        socketId: socket.id
      };
      setIsVoted(
        (voteValue === userVote && !isVoted) || (voteValue !== userVote && true)
      );

      user.currentVote = userVotingDetails.vote;
      user.currentRoomId = userVotingDetails.roomId;
      user.votedState =
        (voteValue === userVote && !isVoted) ||
        (voteValue !== userVote && true);

      socket.emit("isVotedState", {
        roomId: user.currentRoomId,
        userId: user._id,
        votedState:
          (voteValue === userVote && !isVoted) ||
          (voteValue !== userVote && true)
      });

      user!.currentVote = voteValue;
      await UserService.updateUser(user!._id!, user!);
      setUserVote(voteValue);
      const roomUserIndex = roomUsers!.findIndex((r) => r._id === user._id);
      roomUsers![roomUserIndex].votedState =
        (voteValue === userVote && !isVoted) ||
        (voteValue !== userVote && true);
      roomUsers![roomUserIndex].currentVote = voteValue;
      socket.emit("isUserVoted", roomUsers);
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
            className={isDisabled() ? classes.pickCard : classes.glowingCard}
          >
            {!votesCasted ? (
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                {isDisabled() ? (
                  <Grid>
                    <Typography
                      variant="h3"
                      sx={{ fontSize: { md: "32px", xs: "16px" } }}
                    >
                      Pick Your Cards
                    </Typography>
                  </Grid>
                ) : (
                  <Grid sx={{ mt: 2 }}>
                    <Button
                      disabled={isDisabled()}
                      onClick={handleRevealVotes}
                      sx={[
                        {
                          mt: 1,
                          background: "#67A3EE",
                          borderRadius: "5px",
                          color: "white",
                          px: { md: 3, xs: 2 },
                          py: { md: 0.5 },
                          fontSize: "16px"
                        },
                        {
                          "&:hover": {
                            background: "secondary.main",
                            color: "#67A3EE"
                          }
                        }
                      ]}
                      variant="outlined"
                    >
                      Reveal Votes
                    </Button>
                  </Grid>
                )}
              </Grid>
            ) : (
              <Grid>
                <Button
                  onClick={handleNewVotingSession}
                  sx={[
                    {
                      mt: 1,
                      width: { md: "250px", xs: "200px" },
                      background: "#67A3EE",
                      borderRadius: "5px",
                      color: "white",
                      px: { md: 3, xs: 2 },
                      py: { md: 0.5 },
                      fontSize: { md: "16px", xs: "12px" }
                    },
                    {
                      "&:hover": {
                        background: "secondary.main",
                        color: "#67A3EE"
                      }
                    }
                  ]}
                  variant="outlined"
                >
                  {" "}
                  Start New Voting Session
                </Button>
              </Grid>
            )}
          </Grid>

          <Grid
            sx={{
              // background: "red",
              width: "90vw",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              mt: 2
            }}
          >
            {roomUsers &&
              roomUsers.map((roomUser: IUserDetails, i: number) => (
                <Grid key={roomUser._id}>
                  <Card
                    variant="outlined"
                    sx={[
                      {
                        width: { md: 80, xs: 70 },
                        height: { md: 120, xs: 100 },
                        mx: { md: 2, xs: 1 },
                        border: "1px solid #67A3EE",
                        cursor: "pointer",
                        borderRadius: { md: "8px", xs: "4px" },
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        boxShadow: 5,
                        transition: "transform ease 300ms",
                        background: roomUser!.votedState! ? "#67A3EE" : "white"
                      },
                      {
                        "&:hover": {
                          borderRadius: "8px"
                        }
                      }
                    ]}
                  >
                    {!!votesCasted ? (
                      <CardContent>
                        <Typography variant="h4">
                          {votesCasted[i]?.currentVote}
                        </Typography>
                      </CardContent>
                    ) : (
                      <Grid>
                        <Typography variant="h3" sx={{ color: "white" }}>
                          {roomUser.votedState
                            ? roomUser._id === userId && roomUser?.currentVote
                            : undefined}
                        </Typography>
                      </Grid>
                    )}
                  </Card>
                  <Grid
                    sx={{
                      mt: 1,
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center"
                    }}
                  >
                    <Typography variant="h4">
                      {roomUser && roomUser.name}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>

      {!votesCasted && (
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
      )}

      {!!votesCasted && (
        <Slide direction="up" in={!!votesCasted} mountOnEnter unmountOnExit>
          <Grid
            sx={{
              position: "absolute" as "absolute",
              left: 0,
              right: 0,
              bottom: { md: 0, xs: 4 },
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              background: "#67A3EE",
              transition: "width 2s ease-in 1s",
              // mt: "100px",
              width: "100%",
              height: "200px"
            }}
          >
            <VotingResult votesCasted={votesCasted} room={room} />
          </Grid>
        </Slide>
      )}
      <CustomModal isOpen={isModalOpen}>
        <Grid>
          <CreateUser isSubmitting={false} onFormSubmitted={handleCreateUser} />
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default VotingRoom;
