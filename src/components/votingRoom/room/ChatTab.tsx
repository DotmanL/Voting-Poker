import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";
import ChatIcon from "@mui/icons-material/Chat";
import SendIcon from "@mui/icons-material/Send";
import { IRoomUser } from "interfaces/RoomUsers/IRoomUsers";
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

  useEffect(() => {
    if (!socket) return;
    socket.on("sendRoomMessageResponse", (data: any) => {
      if (data) {
        setAllMessages([...allMessages, data.roomMessage]);
      }
    });
  }, [socket, allMessages]);

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
        // top: "40vh",
        bottom: 60,
        zIndex: 100,
        left: 100,
        width: "50px",
        height: "50px",
        display: { md: "flex", xs: "none" },
        flexDirection: "row",
        cursor: "pointer",
        justifyContent: "center",
        alignItems: "center"
        // "&:hover": {
        //   transition: "box-shadow 0.3s ease-in-out",
        //   boxShadow: (theme) =>
        //     theme.palette.mode === "dark"
        //       ? "0px 0px 10px 2px rgba(255, 255, 255, 0.2)"
        //       : "0px 0px 10px 2px rgba(0, 0, 0, 0.4)"
        // }
      }}
    >
      {!isChatBoxOpen ? (
        <ChatIcon
          onClick={() => setIsChatBoxOpen(!isChatBoxOpen)}
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
                xs: "none",
                width: "400px",
                borderRadius: "10px",
                marginBottom: "70px",
                padding: "10px",
                height: "500px",
                maxHeight: "500px",
                border: "2px solid gray",
                background: "secondary.main",
                overflowY: "auto"
              },
              flexDirection: "row"
            }}
          >
            <Grid
              sx={{
                width: "100%",
                height: "100%"
              }}
            >
              {allMessages.map((am, i) => (
                <Grid
                  sx={{
                    marginY: "8px",
                    paddingX: "10px",
                    borderRadius: "20px",
                    background: "secondary.main",
                    border: "0.5px solid",
                    borderColor: "primary.main",
                    display: "flex",
                    flexDirection: "column",

                    alignItems:
                      currentRoomUser._id === am.userId
                        ? "flex-end"
                        : "flex-start"
                  }}
                  key={i}
                >
                  <Typography
                    sx={{
                      color: roomUsers.find((user) => user._id === am.userId)
                        ?.cardColor
                    }}
                    fontSize={20}
                  >
                    {am.userName}
                  </Typography>
                  <Typography fontSize={18} sx={{ wordBreak: "break-word" }}>
                    {am.message}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Grid
              sx={{
                display: "flex",
                alignItems: "center",
                paddingRight: "10px",
                position: "absolute",
                bottom: 0,
                zIndex: 3000,
                left: 0,
                height: "auto",
                width: "400px",
                background: (theme) =>
                  theme.palette.mode === "dark" ? "white" : "black",
                border: "2px solid",
                borderColor: "primary.main",
                borderRadius: "10px"
              }}
            >
              <TextField
                sx={{
                  width: "100%",
                  border: "none",
                  paddingX: "2px",
                  paddingY: "3px",
                  overflowY: "auto"
                }}
                // multiline
                // rows={3}
                InputProps={{
                  sx: {
                    maxHeight: "60px",

                    color: (theme) =>
                      theme.palette.mode === "dark" ? "black" : "white",
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
                sx={{ marginLeft: 1, color: "green" }}
                onClick={handleSendMessage}
              />
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ChatTab;
