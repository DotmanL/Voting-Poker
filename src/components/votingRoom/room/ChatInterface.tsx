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
        bottom: 30,
        zIndex: 120,
        left: 100,
        width: "50px",
        height: "50px",
        display: { md: "flex", xs: "none" },
        flexDirection: "row",
        cursor: "pointer",
        justifyContent: "center",
        alignItems: "center"
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
          <ChatIcon
            onClick={() => {
              setIsChatBoxOpen(!isChatBoxOpen);
            }}
            sx={{
              width: "50px",
              height: "50px"
            }}
          />
        </animated.div>
      ) : (
        <CancelIcon
          onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
          sx={{
            width: "50px",
            height: "50px"
          }}
        />
      )}

      <Grid
        sx={{
          position: "absolute",
          bottom: 60,
          left: 0,
          width: "400px",
          height: "auto",
          display: { md: "flex", xs: "none" },
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? "#171a1d" : "#adb5bd",
          borderRadius: "15px",
          flexDirection: "row",
          cursor: "pointer",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        {isChatBoxOpen && (
          <Grid
            sx={{
              display: {
                md: "flex",
                flexDirection: "column",
                width: "400px",
                height: "350px",
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
                    height: "350px"
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
                      Object.keys(roomGroupedMessages).map((messageDate, i) => (
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
                                  marginY: "8px",
                                  marginRight: "8px",
                                  paddingX: "10px",
                                  width: "70%",
                                  paddingY: "2px",
                                  borderRadius: "5px",
                                  color: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "white"
                                      : "black",
                                  background: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "#343a40"
                                      : "#dee2e6",
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
                                    color: roomUsers.find(
                                      (user) => user._id === message.userId
                                    )?.cardColor
                                  }}
                                  fontSize={18}
                                >
                                  {currentRoomUser._id === message.userId
                                    ? "me"
                                    : message.userName}
                                </Typography>
                                <Typography
                                  fontSize={16}
                                  sx={{
                                    wordBreak: "break-word",
                                    alignSelf: "flex-start",
                                    display: "flex"
                                  }}
                                >
                                  {message.message}
                                </Typography>
                              </Grid>
                            )
                          )}
                        </Grid>
                      ))}
                  </Grid>
                </Scrollbar>
              )}
            </>

            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                paddingRight: "4px",
                position: "absolute",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
                mt: 4,
                bottom: 0,
                zIndex: 80,
                left: 0,
                height: "auto",
                width: "400px",
                background: (theme) =>
                  theme.palette.mode === "dark" ? "#171a1d" : "#adb5bd",
                borderTop: "1px solid",
                borderColor: "#8d99ae"
              }}
            >
              <TextField
                sx={{
                  width: "100%",
                  border: "none",
                  paddingX: "2px",
                  paddingY: "2px",
                  maxHeight: "90px",
                  overflowY: "auto",
                  "& fieldset": { border: "none" }
                }}
                autoFocus={true}
                autoComplete="false"
                placeholder="Send a message..."
                multiline
                rows={2}
                InputProps={{
                  sx: {
                    color: (theme) =>
                      theme.palette.mode === "dark" ? "white" : "black",
                    border: "none"
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
              <SendIcon
                sx={{
                  marginLeft: 1,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "white" : "black"
                }}
                onClick={() =>
                  userMessage.length > 0 && handleSendMessageAsync()
                }
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ChatInterface;
