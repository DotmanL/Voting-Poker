import React, { useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { IRoomUsers } from "interfaces/RoomUsers";
import { UserContext } from "utility/providers/UserProvider";
import { IRoom } from "interfaces/Room/IRoom";
import Typography from "@mui/material/Typography";
import { SidebarContext } from "utility/providers/SideBarProvider";
// import { useSpring, animated } from "react-spring";
// import PartyPopper from "../assets/partyPopper.gif";

type Props = {
  votesCasted?: IRoomUsers[];
  room: IRoom;
  userCardColor: string;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
};

function VotingResult(props: Props) {
  const { currentUser } = useContext(UserContext);
  const { isSidebarOpen } = useContext(SidebarContext);
  const { votesCasted, room, userCardColor, setShowCelebration } = props;

  // const animationProps = useSpring({
  //   from: { y: 0 },
  //   to: { y: showCelebration ? 50 : 0 },
  //   config: { mass: 1, tension: 120, friction: 14 }
  // });

  const checkEquality = (votesCasted: IRoomUsers[], currentVote: string) => {
    const values = votesCasted.map((item: IRoomUsers) => item[currentVote]);
    const allEqual = values.every(
      (val: number, i: number, arr: number[]) => val === arr[0]
    );
    return allEqual;
  };

  useEffect(() => {
    let celebrationTimeout: NodeJS.Timeout;
    if (checkEquality(votesCasted!, "currentVote")) {
      setShowCelebration(true);
      celebrationTimeout = setTimeout(() => {
        setShowCelebration(false);
      }, 15000);
    }
    return () => {
      clearTimeout(celebrationTimeout);
    };
  }, [votesCasted, setShowCelebration]);

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: `${userCardColor}`,
        position: "relative",
        marginRight: isSidebarOpen ? "400px" : ""
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          position: "absolute" as "absolute",
          marginLeft: { md: "100px", xs: "10px" },
          left: 10,
          top: 0,
          bottom: 0
        }}
      >
        {/* Celebration placeholder */}
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "800px",
          flexWrap: "wrap",
          justifyContent: "center",
          py: 1,
          gap: "8px"
        }}
      >
        {votesCasted?.map((v, i) => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              borderRadius: "12px",
              px: 2,
              py: 0.6,
              background: (theme) => theme.palette.secondary.main,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 2px 10px rgba(0, 0, 0, 0.3)"
                  : "0 2px 10px rgba(0, 0, 0, 0.1)",
              transition: "all 0.25s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0 4px 16px rgba(0, 0, 0, 0.4)"
                    : "0 4px 16px rgba(0, 0, 0, 0.14)"
              }
            }}
            key={i}
          >
            <Typography
              sx={{
                fontSize: { md: "16px", xs: "13px" },
                fontWeight: 500,
                mr: 1.5,
                maxWidth: "120px",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {room.roomId === currentUser!.currentRoomId && v.userName}
            </Typography>
            <Grid
              sx={{
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                fontSize: "16px",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.06)"
                    : "rgba(0, 0, 0, 0.04)"
              }}
            >
              {v.currentVote}
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default VotingResult;
