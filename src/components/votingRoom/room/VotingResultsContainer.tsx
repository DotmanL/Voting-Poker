import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import { IRoom } from "interfaces/Room/IRoom";
import React, { useContext } from "react";
import VotingCard from "./VotingCard";
import VotingResult from "./VotingResult";
import { IRoomUsers } from "interfaces/RoomUsers";
import { SidebarContext } from "utility/providers/SideBarProvider";

type Props = {
  room: IRoom;
  votesCasted: IRoomUsers[] | undefined;
  userCardColor: string;
  handleAddVote: (voteValue: number | string) => Promise<void>;
  setShowCelebration: React.Dispatch<React.SetStateAction<boolean>>;
};

function VotingResultsContainer(props: Props) {
  const {
    room,
    votesCasted,
    handleAddVote,
    userCardColor,
    setShowCelebration
  } = props;
  const { isSidebarOpen } = useContext(SidebarContext);

  return (
    <Grid>
      {!votesCasted && (
        <Grid
          sx={{
            position: "absolute",
            backgroundColor: "secondary.main",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            py: 0.2,
            alignItems: "center",
            width: { md: "100%", xs: "100vw" },
            height: { md: "120px", xs: "150px" },
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <Grid
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              marginRight: isSidebarOpen ? "400px" : ""
            }}
          >
            <VotingCard
              votingSystem={room.votingSystem}
              handleClickCard={handleAddVote}
              userCardColor={userCardColor}
            />
          </Grid>
        </Grid>
      )}
      <Grid
        sx={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        {!!votesCasted && (
          <Slide direction="up" in={!!votesCasted} mountOnEnter unmountOnExit>
            <Grid
              sx={{
                position: "absolute absolute",
                left: 0,
                right: 0,
                bottom: 0,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                background: (theme) => theme.palette.primary.main,
                width: "100%",
                height: "200px"
              }}
            >
              <VotingResult
                setShowCelebration={setShowCelebration}
                userCardColor={userCardColor}
                votesCasted={votesCasted}
                room={room}
              />
            </Grid>
          </Slide>
        )}
      </Grid>
    </Grid>
  );
}

export default VotingResultsContainer;
