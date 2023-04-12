import React, { useContext, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { userContext } from "App";
import { IUserDetails } from "interfaces/User/IUserDetails";
import { IRoom } from "interfaces/Room/IRoom";
import Typography from "@mui/material/Typography";
import { SidebarContext } from "utility/providers/SideBarProvider";
import { useSpring, animated } from "react-spring";
import PartyPopper from "./assets/partyPopper.gif";
import popSound from "./assets/cheers.mp3";
import useSound from "use-sound";

type Props = {
  votesCasted?: IUserDetails[];
  room: IRoom;
};

function VotingResult(props: Props) {
  const user = useContext(userContext);
  const { isSidebarOpen } = useContext(SidebarContext);
  const { votesCasted, room } = props;
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [playPop] = useSound(popSound);

  const animationProps = useSpring({
    from: { y: 0 },
    to: { y: showCelebration ? 50 : 0 },
    config: { mass: 1, tension: 120, friction: 14 },
    onRest: () => {
      if (showCelebration) {
        playPop();
      }
    }
  });

  const checkEquality = (votesCasted: IUserDetails[], currentVote: string) => {
    const values = votesCasted.map((item: IUserDetails) => item[currentVote]);
    const allEqual = values.every(
      (val: number, i: number, arr: number[]) => val === arr[0]
    );
    return allEqual;
  };

  useEffect(() => {
    if (checkEquality(votesCasted!, "currentVote")) {
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
      }, 20000);
    }
  }, [votesCasted]);

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "row",
        width: "100vw",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        marginRight: isSidebarOpen ? "400px" : ""
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          position: "absolute" as "absolute",
          marginLeft: "100px",
          left: 10,
          top: 0
        }}
      >
        {showCelebration && (
          <Grid>
            <animated.div
              style={{
                transform: animationProps.y.to(
                  (val) => `translateY(-${val}px)`
                ),
                display: "flex",
                justifyContent: "center"
              }}
            >
              <img src={PartyPopper} alt="Cheers" width="200" height="200" />
            </animated.div>
          </Grid>
        )}
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "800px",
          flexWrap: "wrap",
          justifyContent: "center"
        }}
      >
        {votesCasted?.map((v, i) => (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              borderRadius: "8px",
              px: 1,
              background: (theme) => theme.palette.secondary.main,
              m: 1
            }}
            key={i}
          >
            <Grid>
              <Typography sx={{ fontSize: "25px", ml: 2 }}>
                {room.roomId === user!.currentRoomId && v.name}
              </Typography>
            </Grid>
            <Grid
              sx={{
                mx: 2,
                background: (theme) => theme.palette.secondary.main
              }}
              key={i}
            >
              <Typography sx={{ fontSize: "25px" }}>{v.currentVote}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

export default VotingResult;
