import { useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { userContext } from "App";
import CustomModal from "components/shared/component/CustomModal";
import { IRoom } from "interfaces/Room/IRoom";
import { IUser } from "interfaces/User/IUser";
import CreateUser from "./CreateUser";
import { IVotingDetails } from "interfaces/User/IVotingDetails";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { IUserDetails } from "interfaces/User/IUserDetails";
import { toast } from "react-toastify";
import { makeStyles } from "@mui/styles";
import { Button } from "@mui/material";
import UserService from "api/UserService";
import { getBaseUrlWithoutRoute } from "api";
import VotingResultsContainer from "./VotingResultsContainer";

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
    position: "relative",
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
    position: "relative",
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
  handleCreateUser: (user: IUser) => void;
  isModalOpen: boolean;
};

interface CardPositions {
  [key: string]: { top: number; left: number };
}

function VotingRoom(props: Props) {
  const { room, handleCreateUser, isModalOpen } = props;
  const classes = useStyles();
  const user = useContext(userContext);
  const [socket, setSocket] = useState<any>(null);
  const [roomUsers, setRoomUsers] = useState<IUserDetails[]>();
  const [userVote, setUserVote] = useState<number | undefined>();
  const [votesCasted, setVotesCasted] = useState<IUserDetails[] | undefined>();
  const [cardPositions, setCardPositions] = useState<CardPositions>({});

  // const [isDisabled, setIsDisabled]= useState<boolean>()
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const getRoomId = useParams();
  const getUserId = localStorage.getItem("userId");
  const userId = getUserId ? JSON.parse(getUserId) : null;

  useEffect(() => {
    const newSocket = io(getBaseUrlWithoutRoute());
    setSocket(newSocket);

    return () => {
      // TODO: can't reset vote on leaving room, only do when vote session is completed.
      // TODO: implement many to many relationship between each room and userId and userVote.
      // user!.votedState = false;
      // user!.currentVote = undefined;
      // newSocket.emit("leaveRoom", { userId });
      newSocket.disconnect();
    };
  }, [user, userId]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("user", {
      name: user?.name,
      _id: user?._id,
      socketId: socket.id && socket.id,
      roomId: getRoomId.roomId,
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

    socket.on("votesResponse", (userVotingDetails: IUserDetails[]) => {
      setVotesCasted(userVotingDetails);
    });

    socket.on("isVotedResponse", (data: IUser) => {
      if (data._id === user?._id) {
        setIsVoted(data.votedState!);
        user!.votedState = data.votedState;
      }
    });

    return () => {
      socket.off("user");
    };
  }, [room, socket, user, getRoomId.roomId]);

  const radius = 200;
  const centerX = 200;
  const centerY = 100;

  useEffect(() => {
    const numCards = roomUsers?.length; // get the number of cards;

    const positions = generateCardPositions(
      numCards!,
      radius,
      centerX,
      centerY
    );
    setCardPositions(positions);
  }, [roomUsers?.length]);

  const generateCardPositions = (
    numCards: number,
    radius: number,
    centerX: number,
    centerY: number
  ) => {
    const positions: CardPositions = {};
    for (let i = 0; i < numCards; i++) {
      const angle = (i / (numCards / 2)) * Math.PI;
      const x = Math.floor(centerX + radius * Math.cos(angle)) - 50;
      const y = Math.floor(centerY + radius * Math.sin(angle)) - 50;
      positions[`card-${i}`] = { top: y, left: x };
    }
    return positions;
  };

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
    console.log(roomUsersVotes);
    console.log(room.roomId);

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
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        background: "red",
        height: "100vh"
      }}
    >
      <Grid className={isDisabled() ? classes.pickCard : classes.glowingCard}>
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
      {roomUsers &&
        roomUsers.map((roomUser: IUserDetails, i: number) => (
          <Card
            key={i}
            variant="outlined"
            style={cardPositions[`card-${i}`]}
            sx={[
              {
                position: "absolute",
                width: { md: 80, xs: 70 },
                height: { md: 120, xs: 100 },

                margin: "20px",
                // mx: { md: 2, xs: 1 },
                border: "1px solid #67A3EE",
                cursor: "pointer",
                borderRadius: { md: "8px", xs: "4px" },
                display: "flex",
                // flexDirection: "row",
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
        ))}
      {/* <Grid
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
              </Grid> */}

      <Grid>
        <VotingResultsContainer
          room={room}
          votesCasted={votesCasted}
          handleAddVote={handleAddVote}
        />
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
