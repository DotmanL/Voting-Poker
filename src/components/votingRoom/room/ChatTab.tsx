import CancelIcon from "@mui/icons-material/Cancel";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import { Grid, Typography } from "@mui/material";
import TextField from "@mui/material/TextField";
import { IRoomUser } from "interfaces/RoomUsers/IRoomUsers";
import { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";

type Props = {
  socket: Socket;
  roomId: string;
  currentRoomUser: IRoomUser;
  roomUsers: IRoomUser[];
};

type Message = {
  userId: string;
  userName: string;
  message: string;
};

function ChatTab(props: Props) {
  const { socket, roomId, roomUsers, currentRoomUser } = props;
  const [isChatBoxOpen, setIsChatBoxOpen] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<Message[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;
    socket.on("sendRoomMessageResponse", (data: any) => {
      if (data) {
        setAllMessages([...allMessages, data.roomMessage]);
      }
    });
  }, [socket, allMessages]);

  //too slow
  useEffect(() => {
    const divElement = scrollContainerRef.current;

    if (
      allMessages &&
      divElement &&
      divElement.scrollHeight > divElement.clientHeight
    ) {
      const targetScrollTop = divElement.scrollHeight - divElement.clientHeight;
      const currentScrollTop = divElement.scrollTop;
      const scrollStep = (targetScrollTop - currentScrollTop) / 60;
      let frame = 0;

      const animateScroll = () => {
        if (frame < 60) {
          // Continue animation for 60 frames (1 second)
          divElement.scrollTop += scrollStep;
          frame++;
          requestAnimationFrame(animateScroll);
        }
      };

      animateScroll();
    }
  }, [allMessages]);

  function handleSendMessage() {
    socket.emit("sendRoomMessage", {
      roomMessage: {
        userId: currentRoomUser._id,
        userName: currentRoomUser.userName,
        message: userMessage
      },
      roomId: roomId
    });
    setUserMessage("");
  }

  return (
    <Grid
      sx={{
        position: "absolute",
        bottom: 60,
        zIndex: 80,
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
        <ChatIcon
          onClick={() => {
            setIsChatBoxOpen(!isChatBoxOpen);
          }}
          sx={{
            width: "50px",
            height: "50px"
          }}
        />
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
            ref={scrollContainerRef}
            sx={{
              display: {
                md: "flex",
                flexDirection: "column",
                width: "400px",
                marginBottom: "70px",
                padding: "10px",
                height: "420px",
                // maxHeight: "420px",
                overflowY: "scroll"
              }
            }}
          >
            {allMessages.map((am, i) => (
              <Grid
                sx={{
                  marginY: "8px",
                  paddingX: "10px",
                  width: "70%",
                  paddingY: "2px",
                  borderRadius: "5px",
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "white" : "black",
                  background: (theme) =>
                    theme.palette.mode === "dark" ? "#343a40" : "#dee2e6",
                  display: "flex",
                  flexDirection: "column",
                  alignSelf:
                    currentRoomUser._id === am.userId
                      ? "flex-end"
                      : "flex-start"
                }}
                key={i}
              >
                <Typography
                  sx={{
                    display: "flex",
                    color: roomUsers.find((user) => user._id === am.userId)
                      ?.cardColor
                  }}
                  fontSize={18}
                >
                  {currentRoomUser._id === am.userId ? "me" : am.userName}
                </Typography>
                <Typography
                  fontSize={16}
                  sx={{
                    wordBreak: "break-word",
                    alignSelf: "flex-start",
                    display: "flex"
                  }}
                >
                  {am.message}
                </Typography>
              </Grid>
            ))}

            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                paddingRight: "10px",
                position: "absolute",
                borderBottomLeftRadius: "15px",
                borderBottomRightRadius: "15px",
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
                  paddingY: "3px",
                  overflowY: "auto",
                  "& fieldset": { border: "none" }
                }}
                placeholder="Send a message..."
                InputProps={{
                  sx: {
                    maxHeight: "60px",
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
                    handleSendMessage();
                  }
                }}
              />
              <SendIcon
                sx={{
                  marginLeft: 1,
                  color: (theme) =>
                    theme.palette.mode === "dark" ? "white" : "black"
                }}
                onClick={() => userMessage.length > 0 && handleSendMessage()}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ChatTab;
