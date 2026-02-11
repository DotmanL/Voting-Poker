import CancelIcon from "@mui/icons-material/Cancel";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import { Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import RoomMessageService from "api/RoomMessageService";
import Spinner from "components/shared/component/Spinner";
import {
  IRoomMessage,
  IUserMessage
} from "interfaces/RoomMessages/IRoomMessage";
import { IRoomUser } from "interfaces/RoomUsers/IRoomUsers";
import { useCallback, useEffect, useRef, useState } from "react";
import { QueryObserverResult } from "react-query";
import { Scrollbar } from "react-scrollbars-custom";
import { animated, useSpring } from "react-spring";
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket;
  roomId: string;
  currentRoomUser: IRoomUser;
  isLoadingMessages: boolean;
  isErrorMessages: Error | null;
  roomMessages: IUserMessage[] | undefined;
  roomUsers: IRoomUser[];
  refetchMessages: () => Promise<
    QueryObserverResult<IUserMessage[] | undefined, Error>
  >;
};

interface GroupedMessages {
  [key: string]: IUserMessage[];
}

function ChatInterface(props: Props) {
  const {
    socket,
    roomId,
    roomUsers,
    currentRoomUser,
    isLoadingMessages,
    isErrorMessages,
    roomMessages,
    refetchMessages
  } = props;
  const [isChatBoxOpen, setIsChatBoxOpen] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<IUserMessage[]>([]);
  const [roomGroupedMessages, setRoomGroupedMessages] =
    useState<GroupedMessages>();
  const scrollContainerRef = useRef<Scrollbar & HTMLDivElement>(null);

  const [animationProps, api] = useSpring(
    () => ({
      y: 0,
      config: { mass: 1, tension: 120, friction: 14, bounce: 5 }
    }),
    []
  );

  const groupMessagesByDay = (messages: IUserMessage[]) => {
    const groupedMessages: GroupedMessages = {};
    messages.forEach((message) => {
      const messageDate = new Date(message?.messageTime!).toDateString();
      if (groupedMessages[messageDate]) {
        groupedMessages[messageDate].push(message);
      } else {
        groupedMessages[messageDate] = [message];
      }
    });
    return groupedMessages;
  };

  useEffect(() => {
    setRoomGroupedMessages(groupMessagesByDay(allMessages));
  }, [allMessages]);

  const appendMessage = useCallback(
    (message: IUserMessage) => {
      setAllMessages((prevMessages) => [...prevMessages, message]);
    },
    [setAllMessages]
  );

  useEffect(() => {
    if (!socket) return;
    let bouncingTimeout: NodeJS.Timeout;
    socket.on("sendRoomMessageResponse", (data: any) => {
      if (data) {
        appendMessage(data.roomMessage);
        api.start({ y: 8 });
        bouncingTimeout = setTimeout(() => {
          api.start({ y: 1 });
        }, 1000);
      }
    });

    return () => {
      clearTimeout(bouncingTimeout);
    };
  }, [socket, appendMessage, api]);

  useEffect(() => {
    async function refreshMessages() {
      if (isChatBoxOpen && roomMessages) {
        await refetchMessages();
        setAllMessages(roomMessages);
        const divElement = scrollContainerRef.current;
        if (divElement) {
          divElement.scrollTop = divElement.scrollHeight;
        }
      }
    }

    refreshMessages();
  }, [isChatBoxOpen, roomMessages, refetchMessages]);

  useEffect(() => {
    const divElement = scrollContainerRef.current;
    if (
      roomGroupedMessages &&
      divElement &&
      divElement.scrollHeight > divElement.clientHeight
    ) {
      const targetScrollTop = divElement.scrollHeight - divElement.clientHeight;
      const currentScrollTop = divElement.scrollTop;
      const scrollStep = (targetScrollTop - currentScrollTop) / 30 + 1;
      let frame = 0;

      const animateScroll = () => {
        if (frame < 30) {
          divElement.scrollTop += scrollStep;
          frame++;
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }
  }, [roomGroupedMessages]);

  async function handleSendMessageAsync() {
    socket.emit("sendRoomMessage", {
      roomMessage: {
        userId: currentRoomUser._id,
        userName: currentRoomUser.userName,
        message: userMessage
      },
      roomId: roomId
    });

    const userMessageToBeSent: IUserMessage = {
      userId: currentRoomUser._id!,
      userName: currentRoomUser.userName,
      message: userMessage,
      messageTime: Date.now()
    };

    const roomMessage: IRoomMessage = {
      roomId: roomId,
      messages: [userMessageToBeSent]
    };

    await RoomMessageService.createOrUpdateRoomMessage(roomMessage);
    refetchMessages();
    setUserMessage("");
  }

  //TODO: handle more gracefully
  if (isErrorMessages) {
    return <div>{(isErrorMessages as Error)?.message}</div>;
  }

  return (
    <Grid
      sx={{
        position: "absolute",
        bottom: 70,
        zIndex: 120,
        left: 100,
        width: "50px",
        height: "50px",
        display: { md: "flex", xs: "none" },
        flexDirection: "row",
        cursor: "pointer",
        justifyContent: "center",
        alignItems: "center",
        borderTop: "none"
      }}
    >
      {!isChatBoxOpen ? (
        <animated.div
          style={{
            transform: animationProps.y
              .to({
                range: [0, 1],
                output: [0, -10]
              })
              .to((y) => `translateY(${y}px)`)
          }}
        >
          <Grid
            onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
            sx={{
              width: "52px",
              height: "52px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: (theme) => theme.palette.primary.main,
              color: (theme) =>
                theme.palette.mode === "dark" ? "#141a1f" : "#ffffff",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 4px 16px rgba(0, 0, 0, 0.4)"
                  : "0 4px 16px rgba(91, 147, 217, 0.3)",
              transition: "all 0.2s ease",
              cursor: "pointer",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 6px 20px rgba(0, 0, 0, 0.5)"
                    : "0 6px 20px rgba(91, 147, 217, 0.4)"
              }
            }}
          >
            <ChatIcon sx={{ width: "26px", height: "26px" }} />
          </Grid>
        </animated.div>
      ) : (
        <Grid
          onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
          sx={{
            width: "52px",
            height: "52px",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: (theme) =>
              theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.06)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            "&:hover": {
              background: (theme) =>
                theme.palette.mode === "dark"
                  ? "rgba(255, 255, 255, 0.12)"
                  : "rgba(0, 0, 0, 0.1)"
            }
          }}
        >
          <CancelIcon sx={{ width: "26px", height: "26px" }} />
        </Grid>
      )}

      {isChatBoxOpen && (
        <Grid
          sx={{
            position: "absolute",
            bottom: 64,
            left: 0,
            width: "380px",
            height: "auto",
            display: { md: "flex", xs: "none" },
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1c2329" : "#ffffff",
            borderRadius: "18px",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            border: (theme) =>
              theme.palette.mode === "dark"
                ? "1px solid rgba(255, 255, 255, 0.06)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "0 12px 40px rgba(0, 0, 0, 0.5)"
                : "0 12px 40px rgba(0, 0, 0, 0.12)"
          }}
        >
          {isChatBoxOpen && (
            <Grid
              sx={{
                display: {
                  md: "flex",
                  flexDirection: "column",
                  width: "400px",
                  height: "450px",
                  padding: "10px",
                  marginBottom: "75px"
                }
              }}
            >
              <>
                {isLoadingMessages ? (
                  <Spinner />
                ) : (
                  <Scrollbar
                    ref={scrollContainerRef}
                    style={{
                      width: "100%",
                      height: "450px"
                    }}
                    noScrollX
                  >
                    <Grid
                      sx={{
                        display: {
                          md: "flex",
                          flexDirection: "column",
                          height: "100%"
                        }
                      }}
                    >
                      {roomGroupedMessages &&
                        Object.keys(roomGroupedMessages).map(
                          (messageDate, i) => (
                            <Grid
                              key={i}
                              sx={{
                                display: {
                                  md: "flex",
                                  flexDirection: "column",
                                  height: "100%"
                                }
                              }}
                            >
                              <Typography sx={{ mr: "auto", ml: "auto" }}>
                                {messageDate !== "Invalid Date" &&
                                  (messageDate === new Date().toDateString()
                                    ? "Today"
                                    : messageDate)}
                              </Typography>
                              {roomGroupedMessages[messageDate].map(
                                (message, i) => (
                                  <Grid
                                    sx={{
                                      my: "4px",
                                      mx: "8px",
                                      px: "12px",
                                      py: "8px",
                                      maxWidth: "75%",
                                      borderRadius:
                                        currentRoomUser._id === message.userId
                                          ? "14px 14px 4px 14px"
                                          : "14px 14px 14px 4px",
                                      color: (theme) =>
                                        theme.palette.mode === "dark"
                                          ? "#E8EAED"
                                          : "#1a1a2e",
                                      background: (theme) =>
                                        currentRoomUser._id === message.userId
                                          ? theme.palette.mode === "dark"
                                            ? "rgba(232, 234, 237, 0.08)"
                                            : "rgba(91, 147, 217, 0.1)"
                                          : theme.palette.mode === "dark"
                                            ? "rgba(255, 255, 255, 0.04)"
                                            : "rgba(0, 0, 0, 0.04)",
                                      display: "flex",
                                      flexDirection: "column",
                                      alignSelf:
                                        currentRoomUser._id === message.userId
                                          ? "flex-end"
                                          : "flex-start"
                                    }}
                                    key={i}
                                  >
                                    <Typography
                                      sx={{
                                        display: "flex",
                                        fontSize: "12px",
                                        fontWeight: 600,
                                        mb: 0.3,
                                        color: roomUsers.find(
                                          (user) => user._id === message.userId
                                        )?.cardColor
                                      }}
                                    >
                                      {currentRoomUser._id === message.userId
                                        ? "me"
                                        : message.userName}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        fontSize: "14px",
                                        wordBreak: "break-word",
                                        alignSelf: "flex-start",
                                        lineHeight: 1.5
                                      }}
                                    >
                                      {message.message}
                                    </Typography>
                                  </Grid>
                                )
                              )}
                            </Grid>
                          )
                        )}
                    </Grid>
                  </Scrollbar>
                )}
              </>

              <Grid
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: "10px",
                  position: "absolute",
                  borderBottomLeftRadius: "18px",
                  borderBottomRightRadius: "18px",
                  bottom: 0,
                  zIndex: 80,
                  left: 0,
                  height: "auto",
                  width: "380px",
                  py: "6px",
                  background: (theme) =>
                    theme.palette.mode === "dark" ? "#1c2329" : "#ffffff",
                  borderTop: (theme) =>
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(255, 255, 255, 0.06)"
                      : "1px solid rgba(0, 0, 0, 0.06)"
                }}
              >
                <TextField
                  sx={{
                    width: "100%",
                    border: "none",
                    px: "4px",
                    maxHeight: "80px",
                    overflowY: "auto",
                    "& fieldset": { border: "none" },
                    "& .MuiInputBase-root": {
                      fontSize: "14px"
                    }
                  }}
                  autoFocus={true}
                  autoComplete="false"
                  placeholder="Type a message..."
                  multiline
                  rows={2}
                  InputProps={{
                    sx: {
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#E8EAED" : "#1a1a2e",
                      border: "none",
                      p: 0
                    }
                  }}
                  id="userMessage"
                  name="userMessage"
                  value={userMessage}
                  onChange={(event) => {
                    setUserMessage(event.target.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && userMessage.length > 0) {
                      handleSendMessageAsync();
                    }
                  }}
                />
                <Grid
                  onClick={() =>
                    userMessage.length > 0 && handleSendMessageAsync()
                  }
                  sx={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    ml: 0.5,
                    cursor: "pointer",
                    background: (theme) =>
                      userMessage.length > 0
                        ? theme.palette.primary.main
                        : "transparent",
                    color: (theme) =>
                      userMessage.length > 0
                        ? theme.palette.mode === "dark"
                          ? "#141a1f"
                          : "#ffffff"
                        : theme.palette.text.secondary,
                    transition: "all 0.2s ease"
                  }}
                >
                  <SendIcon sx={{ fontSize: "18px" }} />
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default ChatInterface;
