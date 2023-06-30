import React, { useContext, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { userContext } from "App";
import { IRoomUsers } from "interfaces/RoomUsers";
import { IRoom } from "interfaces/Room/IRoom";
import Typography from "@mui/material/Typography";
import { SidebarContext } from "utility/providers/SideBarProvider";
import { useSpring, animated } from "react-spring";
import PartyPopper from "../assets/partyPopper.gif";

type Props = {
  votesCasted?: IRoomUsers[];
  room: IRoom;
  userCardColor: string;
};

function VotingResult(props: Props) {
  const user = useContext(userContext);
  const { isSidebarOpen } = useContext(SidebarContext);
  const { votesCasted, room, userCardColor } = props;
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const animationProps = useSpring({
    from: { y: 0 },
    to: { y: showCelebration ? 50 : 0 },
    config: { mass: 1, tension: 120, friction: 14 }
  });

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
      }, 10000);
    }
    return () => {
      clearTimeout(celebrationTimeout);
    };
  }, [votesCasted]);

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
                {room.roomId === user!.currentRoomId && v.userName}
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
