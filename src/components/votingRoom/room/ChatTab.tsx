import { Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import CancelIcon from "@mui/icons-material/Cancel";
import TextField from "@mui/material/TextField";

import ChatIcon from "@mui/icons-material/Chat";

function ChatTab() {
  const [isChatBoxOpen, setIsChatBoxOpen] = useState<boolean>(false);
  const [userMessage, setUserMessage] = useState<string>("");

  console.log(userMessage);

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
                padding: "10px",
                height: "500px",
                maxHeight: "500px",
                border: "2px solid gray",
                background: "secondary.main"
              },
              flexDirection: "row"
            }}
          >
            <Typography>user messages</Typography>

            <Grid
              sx={{
                display: "flex",
                position: "absolute",
                bottom: 0,
                zIndex: 300,
                borderRadius: "10px",
                left: 0,
                height: "60px",
                width: "400px",
                backgroundColor: "red"
              }}
            >
              <TextField
                sx={{
                  width: "100%"
                }}
                InputProps={{
                  sx: {
                    height: "60",
                    width: "100%",
                    // background: "white",
                    // color: "black",
                    px: "8px"
                    // border: "2px solid red",
                    // borderRadius: "10px"
                  }
                }}
                id="userMessage"
                name="userMessage"
                // label="Issue url"
                rows={1}
                value={userMessage}
                onChange={(event) => {
                  console.log("hit me");

                  setUserMessage(event.target.value);
                }}
              />
              {/* <form
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%"
                }}
              >
              
              </form> */}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Grid>
  );
}

export default ChatTab;
