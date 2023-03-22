import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import { IRoom } from "interfaces/Room/IRoom";
import { IUserDetails } from "interfaces/User/IUserDetails";
import React from "react";
import VotingCard from "./VotingCard";
import VotingResult from "./VotingResult";
type Props = {
  room: IRoom;
  votesCasted: IUserDetails[] | undefined;
  handleAddVote: (voteValue: number) => Promise<void>;
};

function VotingResultsContainer(props: Props) {
  const { room, votesCasted, handleAddVote } = props;
  return (
    <Grid>
      <Grid>
        {" "}
        {!votesCasted && (
          <Grid
            sx={{
              position: "absolute" as "absolute",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              borderTop: "2px solid #67A3EE",
              width: { md: "100%", xs: "100vw" },
              height: { md: "200px", xs: "150px" },
              left: 0,
              right: 0,
              bottom: { md: 0, xs: 4 }
            }}
          >
            <Grid
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <VotingCard
                votingSystem={room.votingSystem}
                handleClickCard={handleAddVote}
              />
            </Grid>
          </Grid>
        )}
        {!!votesCasted && (
          <Slide direction="up" in={!!votesCasted} mountOnEnter unmountOnExit>
            <Grid
              sx={{
                position: "absolute" as "absolute",
                left: 0,
                right: 0,
                bottom: { md: 0, xs: 4 },
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                background: "#67A3EE",
                transition: "width 2s ease-in 1s",
                width: "100%",
                height: "200px"
              }}
            >
              <VotingResult votesCasted={votesCasted} room={room} />
            </Grid>
          </Slide>
        )}
      </Grid>
    </Grid>
  );
}

export default VotingResultsContainer;
