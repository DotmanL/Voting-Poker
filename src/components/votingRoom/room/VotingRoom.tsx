import { useCallback, useContext, useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import CustomModal from "components/shared/component/CustomModal";
import { IRoom } from "interfaces/Room/IRoom";
import { IUser } from "interfaces/User/IUser";
import CreateUser from "./CreateUser";
import { IVotingDetails } from "interfaces/User/IVotingDetails";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { io } from "socket.io-client";
import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { IRoomUsers } from "interfaces/RoomUsers";
import { makeStyles } from "@mui/styles";
import { Button, Link } from "@mui/material";
import { getBaseUrlWithoutRoute } from "api";
import VotingResultsContainer from "./VotingResultsContainer";
import RightSidebar from "../sideBar/RightSidebar";
import { IIssue } from "interfaces/Issues";
import { SidebarContext } from "utility/providers/SideBarProvider";
import UserService from "api/UserService";
import IssueService from "api/IssueService";
import { useQuery } from "react-query";
import RoomUsersService, {
  RoomUserUpdate,
  RoomUsersUpdate
} from "api/RoomUsersService";
import { IssueContext } from "utility/providers/IssuesProvider";
import JiraService from "api/JiraService";
import { UserContext } from "utility/providers/UserProvider";
import ColorPallete from "./ColorPallete";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import ChatInterface from "./ChatInterface";
import { IUserMessage } from "interfaces/RoomMessages/IRoomMessage";
import RoomMessageService from "api/RoomMessageService";

const useStyles = makeStyles((theme) => ({
  "@keyframes glowing": {
    from: {
      boxShadow: `0px 0px 10px 3px #67a3ee`
    },
    to: {
      boxShadow: `0px 0px 20px 5px  #67a3ee`
    }
  },

  pickCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "22vh",
    borderRadius: "20px",
    width: "350px",
    height: "150px",
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
    marginTop: "22vh",
    borderRadius: "20px",
    animation: `$glowing 0.5s infinite alternate`,
    width: "350px",
    height: "150px",
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

function VotingRoom(props: Props) {
  const { room, handleCreateUser, isModalOpen } = props;
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const classes = useStyles();
  const { isSidebarOpen } = useContext(SidebarContext);
  const { activeIssue, setActiveIssue } = useContext(IssueContext);

  const [socket, setSocket] = useState<any>(null);
  const [roomUsers, setRoomUsers] = useState<IRoomUsers[]>();
  const [userVote, setUserVote] = useState<number | undefined>();
  const [votesCasted, setVotesCasted] = useState<IRoomUsers[] | undefined>();
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [showActiveIssue, setShowActiveIssue] = useState<boolean>(false);
  const [isJiraTokenValid, setIsJiraTokenValid] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [validityText, setValidityText] = useState<string>("");
  const [isJiraManagementModalOpen, setIsJiraManagementModalOpen] =
    useState<boolean>(false);
  const [isFirstLauchJiraModalOpen, setIsFirstLaunchJiraModalOpen] =
    useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const getRoomId = useParams();
  const getUserId = localStorage.getItem("userId");
  const userId = getUserId ? JSON.parse(getUserId) : null;
  const roomId = Object.values(getRoomId)[0];
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const jiraAuthenticate = params.get("jiraAuthenticate");
  const { width, height } = useWindowSize();

  const currentRoomUser = roomUsers?.find(
    (ru) => ru._id === currentUser?._id! && ru.roomId === roomId
  );

  const {
    isLoading,
    error,
    data: issues,
    refetch: refetchIssues
  } = useQuery<IIssue[] | undefined, Error>("getIssues", async () =>
    IssueService.getAllIssues(roomId!)
  );

  const {
    isLoading: isLoadingMessages,
    error: isErrorMessages,
    data: roomMessages,
    refetch: refetchMessages
  } = useQuery<IUserMessage[] | undefined, Error>("getMessages", async () =>
    RoomMessageService.getRoomMessages(roomId!)
  );

  const joinRoom = useCallback(async () => {
    const roomUsersFormData = {
      userId: currentUser?._id!,
      roomId: getRoomId.roomId!,
      userName: currentUser?.name!
    };
    const roomUsersData = await RoomUsersService.getRoomUsersByRoomId(
      getRoomId.roomId!
    );
    const existingRoomUsersData = roomUsersData.find(
      (roomUserData) =>
        roomUserData.roomId === getRoomId.roomId &&
        roomUserData.userId === currentUser?._id!
    );

    if (!!currentUser && !existingRoomUsersData) {
      await RoomUsersService.createRoomUsers(roomUsersFormData);
    }
  }, [getRoomId.roomId, currentUser]);

  const getActiveIssue = useCallback(async () => {
    const roomUsersData = await RoomUsersService.getRoomUsersByRoomId(roomId!);
    const activeIssueId = roomUsersData.find(
      (rud) => rud.roomId === roomId
    )?.activeIssueId;

    if (!activeIssueId) {
      setShowActiveIssue(false);
      return;
    }
    const activeIssue = await IssueService.getIssue(activeIssueId);

    if (!activeIssue) {
      return;
    }
    setActiveIssue(activeIssue);
    setShowActiveIssue(true);
    return activeIssue;
  }, [roomId, setActiveIssue]);

  const checkTokenValidity = useCallback(async () => {
    try {
      const response = await JiraService.jiraAccessibleResources(
        currentUser?._id!
      );

      if (response?.status === 200) {
        setIsJiraTokenValid(true);
      }
      if (currentUser?.jiraAccessToken && !response) {
        await JiraService.jiraAuthenticationAutoRefresh(currentUser?._id!);
        setIsJiraTokenValid(true);
      }
      return response;
    } catch (err) {
      setIsJiraTokenValid(false);
      setValidityText("Jira token has expired");
    }
  }, [currentUser?._id, currentUser?.jiraAccessToken]);

  useEffect(() => {
    const newSocket = io(getBaseUrlWithoutRoute());
    setSocket(newSocket);
    checkTokenValidity();
    joinRoom();
    getActiveIssue();
    if (jiraAuthenticate) {
      setIsJiraManagementModalOpen(true);
      setIsFirstLaunchJiraModalOpen(true);
      navigate(`/room/${roomId}`);
    }

    return () => {
      newSocket.disconnect();
    };
  }, [
    joinRoom,
    getActiveIssue,
    checkTokenValidity,
    jiraAuthenticate,
    navigate,
    roomId
  ]);

  useEffect(() => {
    if (!roomUsers) {
      setIsDisabled(true);
    }

    if (!!roomUsers && roomUsers?.length > 0 && !!currentUser) {
      const disabled =
        roomUsers.filter((ru) => ru.votedState === true).length <
        roomUsers.length;
      setIsDisabled(disabled);
    }
  }, [roomUsers, currentUser]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("user", {
      userName: currentUser?.name,
      _id: currentUser?._id,
      socketId: socket.id && socket.id,
      roomId: getRoomId.roomId,
      votedState: currentUser?.votedState,
      currentVote: currentUser?.currentVote
    });

    socket.on("userResponse", async (data: IRoomUsers[]) => {
      const roomUsersData = await RoomUsersService.getRoomUsersByRoomId(
        getRoomId.roomId!
      );
      const userResponse = () => {
        const getRoomOnlyData = data.filter((d) => d.roomId === room.roomId);

        for (let i = 0; i < getRoomOnlyData.length; i++) {
          const roomOnlyData = getRoomOnlyData[i];
          const roomUserData = roomUsersData.find(
            (rud) => rud.userId === roomOnlyData._id
          );

          if (roomUserData) {
            roomOnlyData.currentVote = roomUserData.currentVote;
            roomOnlyData.votedState = roomUserData.votedState;
            roomOnlyData.cardColor = roomUserData.cardColor;
          }
        }
        return getRoomOnlyData;
      };

      if (!currentUser) {
        return;
      }

      const roomData = userResponse();
      setRoomUsers(roomData!);
    });

    // socket.on("welcome", (data: any) => {
    //   const welcomeMessage = ` Hi ${user && user.name}, welcome to ${
    //     room.name
    //   } room`;
    //   if (data.userId === user!._id) {
    //     toast.success(welcomeMessage, { autoClose: 100, pauseOnHover: true });
    //   }
    // });

    socket.on("isUserVotedResponse", (data: IRoomUsers[]) => {
      const getRoomOnlyData = data.find(
        (d) => d.roomId === room.roomId && d._id === currentUser?._id
      );

      if (!!getRoomOnlyData) {
        setRoomUsers(data);
      }
    });

    socket.on("votesResponse", (userVotingDetails: IRoomUsers[]) => {
      setVotesCasted(userVotingDetails);
      refetchIssues();
    });
    socket.on("endCelebrationResponse", (data: any) => {
      if (data) {
        setShowCelebration(data.isCelebration);
      }
    });

    socket.on("isVotedResponse", (data: IUser) => {
      if (data._id === currentUser?._id) {
        setIsVoted(data.votedState!);
        currentUser!.votedState = data.votedState;
      }
    });

    socket.on("isActiveCardOpenResponse", (data: any) => {
      const currentActiveIssue = issues?.find(
        (issue) => issue._id === data.activeIssueId
      );
      if (!data.isActiveCardSelected) {
        setActiveIssue(undefined);
      }
      if (!currentActiveIssue) {
        setShowActiveIssue(data.isActiveCardSelected);
        return;
      }
      setActiveIssue(currentActiveIssue);
      setShowActiveIssue(data.isActiveCardSelected);
    });

    socket.on("updateActiveIssueIdResponse", async (data: any) => {
      if (data.roomActiveIssueId) {
        const activeIssueInRoom = await IssueService.getIssue(
          data.roomActiveIssueId
        );
        setActiveIssue(activeIssueInRoom);
        setShowActiveIssue(true);
      } else {
        setActiveIssue(undefined);
        setShowActiveIssue(false);
      }
    });

    return () => {
      socket.off("user");
    };
  }, [
    room,
    socket,
    currentUser,
    getRoomId.roomId,
    setActiveIssue,
    setCurrentUser,
    refetchIssues,
    issues,
    roomId
  ]);

  // Legacy
  // const isDisabled = () => {
  //   if (!roomUsers) {
  //     return true;
  //   }
  //   if (!!roomUsers && !!user) {
  //     return roomUsers.filter((ru) => ru.votedState === true).length <
  //       roomUsers!.length
  //       ? true
  //       : false;
  //   }
  // };

  const handleVotesAverage = (roomUsersVotes: IRoomUsers[] | undefined) => {
    const actualRoomUsersVotes = roomUsersVotes?.filter(
      (ruv) => ruv.currentVote !== 0
    );

    const totalVotes = roomUsersVotes!.reduce(
      (acc, curr) => acc + curr.currentVote!,
      0
    );

    const averageVotes = Math.round(totalVotes / actualRoomUsersVotes?.length!);
    return averageVotes;
  };

  const handleRevealVotes = async () => {
    const roomUsersVotes = roomUsers;
    const votesAvg = handleVotesAverage(roomUsersVotes);
    const issueToUpdate = {
      ...activeIssue!,
      storyPoints: votesAvg
    };
    if (activeIssue) {
      await IssueService.updateIssue(activeIssue._id!, issueToUpdate);
    }
    socket.emit("votes", { allVotes: roomUsersVotes, roomId: room.roomId });
  };

  async function setNextIssueToVote() {
    if (!issues) {
      return;
    }
    if (issues.length > 1 && !!activeIssue) {
      const currentIssueIndex = issues.findIndex(
        (issue) => issue._id === activeIssue?._id
      );

      const roomUsersUpdate: RoomUsersUpdate = {
        activeIssueId:
          issues.length === currentIssueIndex + 1
            ? ""
            : issues[currentIssueIndex + 1]._id!
      };
      await RoomUsersService.updateRoomUsers(room.roomId, roomUsersUpdate);

      socket.emit("updateActiveIssueId", {
        roomActiveIssueId:
          issues.length === currentIssueIndex + 1
            ? ""
            : issues[currentIssueIndex + 1]._id!,
        roomId: room.roomId
      });

      setShowActiveIssue(
        issues.length === currentIssueIndex + 1 ? false : true
      );
      setActiveIssue(
        issues.length === currentIssueIndex + 1
          ? undefined
          : issues[currentIssueIndex + 1]
      );
    }
  }

  const handleNewVotingSession = async () => {
    const updatedRoomUsers = roomUsers?.map((ru) => ({
      ...ru,
      votedState: false,
      currentVote: undefined
    }));
    setUserVote(undefined);
    setRoomUsers(updatedRoomUsers);

    const roomUserUpdate: RoomUserUpdate = {
      votedState: false
    };

    await RoomUsersService.resetRoomUserVote(room.roomId, roomUserUpdate);
    socket.emit("votes", {
      allVotes: false,
      roomId: room.roomId
    });
    socket.emit("isUserVoted", updatedRoomUsers ?? []);
    socket.emit("endCelebration", {
      isCelebration: false,
      roomId: room.roomId
    });
    setNextIssueToVote();
  };

  const handleAddVote = async (voteValue: number | string) => {
    function getVoteValue() {
      if (voteValue === "?") {
        return 0;
      } else {
        return voteValue as number;
      }
    }

    const userRoomVote = getVoteValue();

    if (userRoomVote >= 0 && currentUser) {
      const userVotingDetails: IVotingDetails = {
        vote: userRoomVote,
        roomId: getRoomId.roomId!,
        sessionId: `${socket.id}${Math.random()}`,
        socketId: socket.id
      };

      const isVotedState =
        (userRoomVote === userVote && !isVoted) ||
        (userRoomVote !== userVote && true);

      setIsVoted(isVotedState);
      currentUser.currentVote = userVotingDetails.vote;
      currentUser.currentRoomId = userVotingDetails.roomId;
      currentUser.votedState =
        (userRoomVote === userVote && !isVoted) ||
        (userRoomVote !== userVote && true);
      currentUser!.currentVote = getVoteValue();

      socket.emit("isVotedState", {
        roomId: currentUser.currentRoomId,
        userId: currentUser._id,
        votedState: isVotedState
      });

      const roomUserUpdate: RoomUserUpdate = {
        currentVote: currentUser.currentVote!,
        votedState: currentUser.votedState!
      };
      //TODO: handle error properly
      await RoomUsersService.updateRoomUser(
        room.roomId,
        currentUser._id!,
        roomUserUpdate
      );
      setUserVote(getVoteValue());
      const roomUserIndex = roomUsers!.findIndex(
        (r) => r._id === currentUser._id
      );
      roomUsers![roomUserIndex].votedState = isVotedState;
      roomUsers![roomUserIndex].currentVote = getVoteValue();
      socket.emit("isUserVoted", roomUsers);
    }
  };

  async function handleChangeColor(newColor: string, userId: string) {
    const roomUserUpdate: RoomUserUpdate = {
      cardColor: newColor
    };
    currentUser!.cardColor = newColor;
    const updatedUser = await UserService.updateUser(userId, currentUser!);
    setCurrentUser(updatedUser);
    await RoomUsersService.updateRoomUser(roomId!, userId, roomUserUpdate);
    const updatedRoomUsers = [...roomUsers!];

    const currentRoomUserIndex = updatedRoomUsers.findIndex(
      (ru) => ru._id === userId
    );
    if (currentRoomUserIndex !== -1) {
      const updatedCurrentRoomUser = {
        ...updatedRoomUsers[currentRoomUserIndex],
        cardColor: newColor
      };
      updatedRoomUsers[currentRoomUserIndex] = updatedCurrentRoomUser;
      setRoomUsers(updatedRoomUsers);
    }
  }

  const pickCardStyle = {
    border: `2px solid ${currentRoomUser?.cardColor}`
  };

  const glowingCardCardStyle = {
    border: `2px solid ${currentRoomUser?.cardColor}`
  };

  return (
    <Grid
      style={{
        marginRight: isSidebarOpen ? "400px" : "0",
        backgroundColor: "secondary.main",
        height: "100vh"
      }}
    >
      {showCelebration && <Confetti width={width} height={height} />}
      <Grid
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center"
        }}
      >
        {showActiveIssue ? (
          <Grid
            sx={{
              position: "absolute",
              top: { md: 90, xs: 75 },
              left: 0,
              right: 0,
              mt: 1,
              ml: { md: 4, xs: 1 },
              width: { md: "auto", xs: "95vw" },
              height: { md: "auto", xs: "auto" },
              px: 2,
              py: 1,
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              background: "secondary.main",
              border: { md: "0px", xs: "1px solid green" },
              cursor: "pointer",
              alignItems: "flex-start",
              justifyContent: "center"
            }}
          >
            <Typography
              variant="h5"
              sx={{ wordBreak: "break-word", fontSize: { md: 24, xs: 10 } }}
            >
              Voting - {activeIssue?.name}
            </Typography>
            <Link
              variant="h6"
              href={activeIssue?.link}
              target="_blank"
              rel="noreferrer"
              sx={{ wordBreak: "break-word", fontSize: { md: 24, xs: 10 } }}
            >
              {activeIssue?.link}
            </Link>
          </Grid>
        ) : (
          <Grid></Grid>
        )}

        <ColorPallete
          currentRoomUser={currentRoomUser}
          currentUser={currentUser}
          handleChangeColor={handleChangeColor}
        />

        <Grid
          sx={{
            position: "absolute",
            top: 90,
            left: 0,
            width: "100vw",
            height: "70px",
            display: "flex",
            flexDirection: "row",
            cursor: "pointer",
            justifyContent: "flex-end",
            alignItems: "center",
            paddingX: "100px"
          }}
        >
          <Grid>
            <RightSidebar
              socket={socket}
              room={room}
              issues={issues || []}
              refetchIssues={refetchIssues}
              isFirstLauchJiraModalOpen={isFirstLauchJiraModalOpen}
              setIsFirstLaunchJiraModalOpen={setIsFirstLaunchJiraModalOpen}
              isJiraTokenValid={isJiraTokenValid}
              setIsJiraTokenValid={setIsJiraTokenValid}
              validityText={validityText}
              isLoading={isLoading}
              isJiraManagementModalOpen={isJiraManagementModalOpen}
              setIsJiraManagementModalOpen={setIsJiraManagementModalOpen}
              error={error}
            />
          </Grid>
        </Grid>
        <Grid
          className={isDisabled ? classes.pickCard : classes.glowingCard}
          style={isDisabled ? pickCardStyle : glowingCardCardStyle}
        >
          {!votesCasted ? (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
              }}
            >
              {isDisabled ? (
                <Grid>
                  <Typography
                    variant="h3"
                    sx={{ fontSize: { md: "28px", xs: "16px" } }}
                  >
                    Choose Your Cards
                  </Typography>
                </Grid>
              ) : (
                <Grid sx={{ mt: 2 }}>
                  <Button
                    disabled={isDisabled}
                    onClick={handleRevealVotes}
                    sx={[
                      {
                        mt: 1,
                        borderRadius: "5px",
                        borderColor: `${currentRoomUser?.cardColor}`,
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "white" : "black",
                        px: { md: 3, xs: 2 },
                        py: { md: 0.5 },
                        fontSize: "16px"
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
                    width: "auto",
                    borderRadius: "5px",
                    borderColor: `${currentRoomUser?.cardColor}`,
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "white" : "black",
                    px: { md: 2, xs: 1 },
                    py: { md: 1 },
                    fontSize: { md: "16px", xs: "12px" }
                  }
                ]}
                variant="outlined"
              >
                Start New Voting Session
              </Button>
            </Grid>
          )}
        </Grid>

        <Grid
          sx={{
            width: "100vw",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            mt: { md: 2, xs: 2 }
          }}
        >
          {roomUsers &&
            roomUsers.map((roomUser: IRoomUsers, i: number) => (
              <Grid
                key={roomUser._id}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <Card
                  variant="outlined"
                  sx={[
                    {
                      width: { md: 70, xs: 60 },
                      height: { md: 100, xs: 90 },
                      mx: { md: 3, xs: 1 },
                      border: `1px solid ${roomUser?.cardColor}`,
                      cursor: "pointer",
                      borderRadius: { md: "8px", xs: "4px" },
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      boxShadow: 5,
                      transition: "transform ease 300ms",
                      background: roomUser!.votedState!
                        ? ` ${roomUser.cardColor}`
                        : "secondary.main"
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
                      <Typography
                        variant="h3"
                        sx={{
                          color: (theme) =>
                            theme.palette.mode === "dark" ? "white" : "black"
                        }}
                      >
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
                    {roomUser && roomUser.userName}
                  </Typography>
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Grid>

      <Grid>
        <ChatInterface
          socket={socket}
          roomId={getRoomId.roomId!}
          roomUsers={roomUsers || []}
          currentRoomUser={currentRoomUser!}
          isLoadingMessages={isLoadingMessages}
          isErrorMessages={isErrorMessages}
          roomMessages={roomMessages}
          refetchMessages={refetchMessages}
        />
        <VotingResultsContainer
          room={room}
          setShowCelebration={setShowCelebration}
          userCardColor={currentRoomUser?.cardColor!}
          votesCasted={votesCasted}
          handleAddVote={handleAddVote}
        />
      </Grid>
      <CustomModal isOpen={isModalOpen} modalWidth="600px">
        <Grid>
          <CreateUser isSubmitting={false} onFormSubmitted={handleCreateUser} />
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default VotingRoom;
