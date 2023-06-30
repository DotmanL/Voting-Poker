import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  useRef
} from "react";
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
import { useParams, useLocation, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
import { IRoomUsers } from "interfaces/RoomUsers";
import { makeStyles } from "@mui/styles";
import { Button, Link, Tooltip } from "@mui/material";
import { getBaseUrlWithoutRoute } from "api";
import VotingResultsContainer from "./VotingResultsContainer";
import RightSidebar from "../sideBar/RightSidebar";
import PaletteIcon from "@mui/icons-material/Palette";
import { HexColorPicker } from "react-colorful";
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
import FormatColorResetIcon from "@mui/icons-material/FormatColorReset";
import JiraService from "api/JiraService";
import { useClickAway } from "react-use";

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
    marginTop: "25vh",
    borderRadius: "20px",
    width: "400px",
    height: "200px",
    [theme.breakpoints.down("md")]: {
      width: "220px",
      height: "150px"
    }
  },

  glowingCard: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "25vh",
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

function VotingRoom(props: Props) {
  const { room, handleCreateUser, isModalOpen } = props;
  const user = useContext(userContext);
  const classes = useStyles({ cardColor: user?.cardColor });
  const { isSidebarOpen } = useContext(SidebarContext);
  const { activeIssue, setActiveIssue } = useContext(IssueContext);

  const [socket, setSocket] = useState<any>(null);
  const [roomUsers, setRoomUsers] = useState<IRoomUsers[]>();
  const [userVote, setUserVote] = useState<number | undefined>();
  const [votesCasted, setVotesCasted] = useState<IRoomUsers[] | undefined>();
  const [isVoted, setIsVoted] = useState<boolean>(false);
  const [showActiveIssue, setShowActiveIssue] = useState<boolean>(false);
  const [isJiraTokenValid, setIsJiraTokenValid] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [validityText, setValidityText] = useState<string>("");
  const [isJiraManagementModalOpen, setIsJiraManagementModalOpen] =
    useState<boolean>(false);
  const [isFirstLauchJiraModalOpen, setIsFirstLaunchJiraModalOpen] =
    useState<boolean>(false);

  const [isColorPalleteOpen, setIsColorPalleteOpen] = useState<boolean>(false);
  const [color, setColor] = useState("#67A3EE");

  const getRoomId = useParams();
  const getUserId = localStorage.getItem("userId");
  const userId = getUserId ? JSON.parse(getUserId) : null;
  const roomId = Object.values(getRoomId)[0];
  const { search } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(search);
  const jiraAuthenticate = params.get("jiraAuthenticate");

  const colorPalleteRef = useRef<HTMLDivElement>(null);

  useClickAway(colorPalleteRef, () => {
    setIsColorPalleteOpen(false);
  });

  const {
    isLoading,
    error,
    data: issues,
    refetch: refetchIssues
  } = useQuery<IIssue[] | undefined, Error>("getIssues", async () =>
    IssueService.getAllIssues(roomId!)
  );

  const joinRoom = useCallback(async () => {
    const roomUsersFormData = {
      userId: user?._id!,
      roomId: getRoomId.roomId!,
      userName: user?.name!
    };
    const roomUsersData = await RoomUsersService.getRoomUsersByRoomId(
      getRoomId.roomId!
    );
    const existingRoomUsersData = roomUsersData.find(
      (roomUserData) =>
        roomUserData.roomId === getRoomId.roomId &&
        roomUserData.userId === user?._id!
    );

    if (!!user && !existingRoomUsersData) {
      await RoomUsersService.createRoomUsers(roomUsersFormData);
    }
  }, [getRoomId.roomId, user]);

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
      const response = await JiraService.jiraAccessibleResources(user?._id!);

      if (response?.status === 200) {
        setIsJiraTokenValid(true);
      }
      if (user?.jiraAccessToken && !response) {
        await JiraService.jiraAuthenticationAutoRefresh(user?._id!);
        setIsJiraTokenValid(true);
      }
      return response;
    } catch (err) {
      setIsJiraTokenValid(false);
      setValidityText("Jira token has expired");
    }
  }, [user?._id, user?.jiraAccessToken]);

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

    if (!!roomUsers && roomUsers?.length > 0 && !!user) {
      const disabled =
        roomUsers.filter((ru) => ru.votedState === true).length <
        roomUsers.length;
      setIsDisabled(disabled);
    }
  }, [roomUsers, user]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("user", {
      userName: user?.name,
      _id: user?._id,
      socketId: socket.id && socket.id,
      roomId: getRoomId.roomId,
      votedState: user?.votedState,
      currentVote: user?.currentVote,
      cardColor: user?.cardColor
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
          }
        }
        return getRoomOnlyData;
      };

      if (!user) {
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
        (d) => d.roomId === room.roomId && d._id === user?._id
      );

      if (!!getRoomOnlyData) {
        setRoomUsers(data);
      }
    });

    socket.on("votesResponse", (userVotingDetails: IRoomUsers[]) => {
      setVotesCasted(userVotingDetails);
      refetchIssues();
    });

    socket.on("isVotedResponse", (data: IUser) => {
      if (data._id === user?._id) {
        setIsVoted(data.votedState!);
        user!.votedState = data.votedState;
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
    user,
    getRoomId.roomId,
    setActiveIssue,
    refetchIssues,
    issues
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

    if (userRoomVote >= 0 && user) {
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
      user.currentVote = userVotingDetails.vote;
      user.currentRoomId = userVotingDetails.roomId;
      user.votedState =
        (userRoomVote === userVote && !isVoted) ||
        (userRoomVote !== userVote && true);
      user!.currentVote = getVoteValue();

      socket.emit("isVotedState", {
        roomId: user.currentRoomId,
        userId: user._id,
        votedState: isVotedState
      });

      const roomUserUpdate: RoomUserUpdate = {
        currentVote: user.currentVote!,
        votedState: user.votedState!
      };
      await RoomUsersService.updateRoomUser(
        room.roomId,
        user._id!,
        roomUserUpdate
      );
      setUserVote(getVoteValue());
      const roomUserIndex = roomUsers!.findIndex((r) => r._id === user._id);
      roomUsers![roomUserIndex].votedState = isVotedState;
      roomUsers![roomUserIndex].currentVote = getVoteValue();
      socket.emit("isUserVoted", roomUsers);
    }
  };

  async function handleChangeColor(newColor: string, userId: string) {
    setColor(newColor);
    user!.cardColor = newColor;
    await UserService.updateUser(userId, user!);
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
    border: `2px solid ${user?.cardColor}`
  };

  const glowingCardCardStyle = {
    border: `2px solid ${user?.cardColor}`
  };

  return (
    <Grid
      style={{
        marginRight: isSidebarOpen ? "400px" : "0",
        backgroundColor: "secondary.main",
        height: "100vh"
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
              // boxShadow: (theme) =>
              //   theme.palette.mode === "dark"
              //     ? "0px 0px 10px 2px rgba(255, 255, 255, 0.1)"
              //     : "0px 0px 10px 2px rgba(0, 0, 0, 0.1)"
            }}
          >
            <Typography
              variant="h5"
              sx={{ wordBreak: "break-word", fontSize: { md: 24, xs: 10 } }}
            >
              Voting {activeIssue?.name}
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
        <Grid
          sx={{
            position: "absolute",
            top: "20vh",
            left: 80,
            width: "60px",
            height: "60px",
            display: { md: "flex", xs: "none" },
            flexDirection: "row",
            borderRadius: "50%",
            border: `2px solid ${user?.cardColor}`,
            cursor: "pointer",
            justifyContent: "center",
            alignItems: "center",
            "&:hover": {
              transition: "box-shadow 0.3s ease-in-out",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 0px 10px 2px rgba(255, 255, 255, 0.8)"
                  : "0px 0px 10px 2px rgba(0, 0, 0, 0.4)"
            }
          }}
          onClick={() => setIsColorPalleteOpen(!isColorPalleteOpen)}
        >
          <Tooltip title="Change Card Color">
            <PaletteIcon sx={{ width: "60px", height: "60px" }} />
          </Tooltip>
        </Grid>

        <Grid
          ref={colorPalleteRef}
          sx={{
            position: "absolute",
            top: "25vh",
            left: 135,
            width: "auto",
            height: "auto",
            display: { md: "flex", xs: "none" },
            flexDirection: "row",
            cursor: "pointer",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          {isColorPalleteOpen && (
            <Grid
              sx={{
                display: { md: "flex", xs: "none" },
                flexDirection: "row"
              }}
            >
              <Grid>
                <HexColorPicker
                  color={color}
                  onChange={(newColor) =>
                    handleChangeColor(newColor, user?._id!)
                  }
                />
              </Grid>
              <Grid
                sx={{
                  ml: 1,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  height: "200px"
                }}
                onClick={() => handleChangeColor("#67a3ee", user?._id!)}
              >
                <Tooltip title="Reset Color">
                  <FormatColorResetIcon />
                </Tooltip>
              </Grid>
            </Grid>
          )}
        </Grid>
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
                    sx={{ fontSize: { md: "32px", xs: "16px" } }}
                  >
                    Pick Your Cards
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
                        background: `${user?.cardColor}`,
                        borderRadius: "5px",
                        borderColor: `${user?.cardColor}`,
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
                    background: `${user?.cardColor}`,
                    borderRadius: "5px",
                    borderColor: `${user?.cardColor}`,
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
            mt: { md: 3, xs: 3 }
          }}
        >
          {roomUsers &&
            roomUsers.map((roomUser: IRoomUsers, i: number) => (
              <Grid key={roomUser._id}>
                <Card
                  variant="outlined"
                  sx={[
                    {
                      width: { md: 70, xs: 60 },
                      height: { md: 100, xs: 90 },
                      mx: { md: 2, xs: 1 },
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
        <VotingResultsContainer
          room={room}
          userCardColor={user?.cardColor!}
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
