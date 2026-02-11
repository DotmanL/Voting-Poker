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

type Props = {
  room: IRoom;
  socket: any;
  handleCreateUser: (user: IUser) => void;
  isModalOpen: boolean;
};

function VotingRoom(props: Props) {
  const { room, handleCreateUser, isModalOpen } = props;
  const { currentUser, setCurrentUser } = useContext(UserContext);
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

  // Distribute users around the 4 sides of the table
  const distributeUsers = (users: IRoomUsers[]) => {
    const top: IRoomUsers[] = [];
    const bottom: IRoomUsers[] = [];
    const left: IRoomUsers[] = [];
    const right: IRoomUsers[] = [];

    if (!users || users.length === 0) return { top, bottom, left, right };

    const count = users.length;

    if (count <= 2) {
      // 1-2 users: top and bottom
      users.forEach((u, i) => (i % 2 === 0 ? top : bottom).push(u));
    } else if (count <= 4) {
      // 3-4: top, bottom, and sides
      top.push(users[0]);
      bottom.push(users[1]);
      if (users[2]) right.push(users[2]);
      if (users[3]) left.push(users[3]);
    } else {
      // 5+: distribute proportionally
      const topCount = Math.ceil(count / 4);
      const bottomCount = Math.ceil((count - topCount) / 3);
      const rightCount = Math.ceil((count - topCount - bottomCount) / 2);
      const leftCount = count - topCount - bottomCount - rightCount;

      let idx = 0;
      for (let i = 0; i < topCount; i++) top.push(users[idx++]);
      for (let i = 0; i < rightCount; i++) right.push(users[idx++]);
      for (let i = 0; i < bottomCount; i++) bottom.push(users[idx++]);
      for (let i = 0; i < leftCount; i++) left.push(users[idx++]);
    }

    return { top, bottom, left, right };
  };

  const sides = distributeUsers(roomUsers || []);

  const renderUserCard = (roomUser: IRoomUsers, i: number) => {
    const globalIndex =
      roomUsers?.findIndex((ru) => ru._id === roomUser._id) ?? i;
    return (
      <Grid
        key={roomUser._id}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mx: { md: 1.5, xs: 0.5 }
        }}
      >
        <Card
          variant="outlined"
          sx={[
            {
              width: { md: 60, xs: 48 },
              height: { md: 85, xs: 72 },
              border: `1.5px solid ${roomUser?.cardColor}`,
              cursor: "pointer",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 2px 12px rgba(0, 0, 0, 0.3)"
                  : "0 2px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease-in-out",
              background: roomUser!.votedState!
                ? `${roomUser.cardColor}`
                : "secondary.main"
            },
            {
              "&:hover": {
                transform: "translateY(-3px)"
              }
            }
          ]}
        >
          {!!votesCasted ? (
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {votesCasted[globalIndex]?.currentVote}
              </Typography>
            </CardContent>
          ) : (
            <Grid>
              <Typography
                variant="h4"
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
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            fontSize: { md: "16px", xs: "10px" },
            fontWeight: 600,
            maxWidth: { md: "80px", xs: "55px" },
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {roomUser && roomUser.userName}
        </Typography>
      </Grid>
    );
  };

  const renderSideUserCard = (roomUser: IRoomUsers, i: number) => {
    const globalIndex =
      roomUsers?.findIndex((ru) => ru._id === roomUser._id) ?? i;
    return (
      <Grid
        key={roomUser._id}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          my: { md: 1, xs: 0.5 }
        }}
      >
        <Card
          variant="outlined"
          sx={[
            {
              width: { md: 55, xs: 44 },
              height: { md: 78, xs: 65 },
              border: `1.5px solid ${roomUser?.cardColor}`,
              cursor: "pointer",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 2px 12px rgba(0, 0, 0, 0.3)"
                  : "0 2px 12px rgba(0, 0, 0, 0.08)",
              transition: "all 0.3s ease-in-out",
              background: roomUser!.votedState!
                ? `${roomUser.cardColor}`
                : "secondary.main"
            },
            {
              "&:hover": {
                transform: "translateY(-3px)"
              }
            }
          ]}
        >
          {!!votesCasted ? (
            <CardContent sx={{ p: 1, "&:last-child": { pb: 1 } }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {votesCasted[globalIndex]?.currentVote}
              </Typography>
            </CardContent>
          ) : (
            <Grid>
              <Typography
                variant="h5"
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
        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            fontSize: { md: "16px", xs: "9px" },
            fontWeight: 600,
            maxWidth: { md: "70px", xs: "50px" },
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}
        >
          {roomUser && roomUser.userName}
        </Typography>
      </Grid>
    );
  };

  return (
    <Grid
      className="voting-room-bg"
      sx={{
        marginRight: isSidebarOpen ? "400px" : "0",
        backgroundColor: (theme) => theme.palette.secondary.main,
        height: "100vh",
        overflow: "hidden",
        color: (theme) =>
          theme.palette.mode === "dark"
            ? "rgba(103, 163, 238, 0.7)"
            : "rgba(91, 147, 217, 0.6)",
        transition: "margin-right 0.3s ease"
      }}
    >
      {showCelebration && <Confetti width={width} height={height} />}
      <Grid
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          alignItems: "center",
          zIndex: 1
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
              maxWidth: { md: "400px" },
              height: { md: "auto", xs: "auto" },
              px: 2.5,
              py: 1.5,
              borderRadius: "14px",
              display: "flex",
              flexDirection: "column",
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(28, 35, 41, 0.95)"
                  : "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(8px)",
              border: (theme) =>
                theme.palette.mode === "dark"
                  ? "1px solid rgba(255, 255, 255, 0.08)"
                  : "1px solid rgba(0, 0, 0, 0.08)",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 16px rgba(0, 0, 0, 0.3)"
                  : "0 4px 16px rgba(0, 0, 0, 0.06)",
              cursor: "pointer",
              alignItems: "flex-start",
              justifyContent: "center",
              animation: "fadeInUp 0.4s ease-out"
            }}
          >
            <Typography
              sx={{
                fontSize: "11px",
                fontWeight: 600,
                color: "primary.main",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                mb: 0.3
              }}
            >
              Now Voting
            </Typography>
            <Typography
              sx={{
                wordBreak: "break-word",
                fontSize: { md: "16px", xs: "12px" },
                fontWeight: 700,
                letterSpacing: "-0.01em"
              }}
            >
              {activeIssue?.name}
            </Typography>
            {activeIssue?.link && (
              <Link
                href={activeIssue?.link}
                target="_blank"
                rel="noreferrer"
                sx={{
                  wordBreak: "break-word",
                  fontSize: { md: "13px", xs: "10px" },
                  color: "primary.main",
                  mt: 0.3,
                  fontWeight: 500,
                  "&:hover": { textDecoration: "underline" }
                }}
              >
                {activeIssue?.link}
              </Link>
            )}
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
        {/* ====== TABLE LAYOUT ====== */}
        <Grid
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            mt: { md: "20vh", xs: "12vh" },
            width: "100%",
            px: { md: 2, xs: 1 }
          }}
        >
          {/* Top users */}
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-end",
              mb: { md: 1.5, xs: 1 },
              minHeight: { md: "110px", xs: "90px" }
            }}
          >
            {sides.top.map((u, i) => renderUserCard(u, i))}
          </Grid>

          {/* Middle row: Left users | Table | Right users */}
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Left users */}
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                mr: { md: 1.5, xs: 0.5 },
                minWidth: { md: "90px", xs: "65px" }
              }}
            >
              {sides.left.map((u, i) => renderSideUserCard(u, i))}
            </Grid>

            {/* The Table (center area) */}
            <Grid
              sx={{
                position: "relative",
                width: { md: "400px", xs: "230px" },
                height: { md: "190px", xs: "125px" },
                borderRadius: "24px",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(91, 147, 217, 0.04)"
                    : "rgba(91, 147, 217, 0.03)",
                border: (theme) =>
                  theme.palette.mode === "dark"
                    ? `2px solid ${currentRoomUser?.cardColor || "rgba(255,255,255,0.1)"}`
                    : `2px solid ${currentRoomUser?.cardColor || "rgba(0,0,0,0.08)"}`,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? `inset 0 2px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.03)`
                    : `inset 0 2px 30px rgba(0, 0, 0, 0.02), 0 0 0 1px rgba(0,0,0,0.02)`,
                transition: "all 0.4s ease",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "24px",
                  background: (theme: any) =>
                    theme.palette.mode === "dark"
                      ? `radial-gradient(ellipse at center, ${currentRoomUser?.cardColor || "rgba(103,163,238,0.08)"}15, transparent 70%)`
                      : `radial-gradient(ellipse at center, ${currentRoomUser?.cardColor || "rgba(91,147,217,0.06)"}10, transparent 70%)`,
                  pointerEvents: "none"
                },
                ...(!isDisabled && {
                  animation: "tableGlow 0.6s infinite alternate"
                })
              }}
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
                    <Grid
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center"
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: { md: "11px", xs: "9px" },
                          fontWeight: 600,
                          color: "primary.main",
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          mb: 0.5
                        }}
                      >
                        Waiting for votes
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { md: "20px", xs: "13px" },
                          fontWeight: 700,
                          color: "text.secondary",
                          letterSpacing: "-0.01em"
                        }}
                      >
                        Choose Your Cards
                      </Typography>
                    </Grid>
                  ) : (
                    <Button
                      disabled={isDisabled}
                      onClick={handleRevealVotes}
                      sx={{
                        borderRadius: "12px",
                        borderColor: `${currentRoomUser?.cardColor}`,
                        borderWidth: "2px",
                        color: (theme) =>
                          theme.palette.mode === "dark" ? "white" : "black",
                        px: { md: 3.5, xs: 2.5 },
                        py: { md: 0.8, xs: 0.5 },
                        fontSize: { md: "15px", xs: "12px" },
                        fontWeight: 700,
                        letterSpacing: "0.01em",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderWidth: "2px",
                          transform: "translateY(-2px)",
                          boxShadow: `0 4px 16px ${currentRoomUser?.cardColor}30`
                        }
                      }}
                      variant="outlined"
                    >
                      Reveal Votes
                    </Button>
                  )}
                </Grid>
              ) : (
                <Button
                  onClick={handleNewVotingSession}
                  sx={{
                    borderRadius: "12px",
                    borderColor: `${currentRoomUser?.cardColor}`,
                    borderWidth: "2px",
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "white" : "black",
                    px: { md: 3, xs: 2 },
                    py: { md: 0.8, xs: 0.5 },
                    fontSize: { md: "14px", xs: "11px" },
                    fontWeight: 700,
                    letterSpacing: "0.01em",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      borderWidth: "2px",
                      transform: "translateY(-2px)",
                      boxShadow: `0 4px 16px ${currentRoomUser?.cardColor}30`
                    }
                  }}
                  variant="outlined"
                >
                  New Voting Session
                </Button>
              )}
            </Grid>

            {/* Right users */}
            <Grid
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                ml: { md: 1.5, xs: 0.5 },
                minWidth: { md: "90px", xs: "65px" }
              }}
            >
              {sides.right.map((u, i) => renderSideUserCard(u, i))}
            </Grid>
          </Grid>

          {/* Bottom users */}
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "flex-start",
              mt: { md: 1.5, xs: 1 },
              minHeight: { md: "110px", xs: "90px" }
            }}
          >
            {sides.bottom.map((u, i) => renderUserCard(u, i))}
          </Grid>
        </Grid>
        {/* ====== END TABLE LAYOUT ====== */}
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
