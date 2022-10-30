import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import { userContext } from "App";
import { IUserDetails } from "interfaces/User/IUserDetails";
import { IRoom } from "interfaces/Room/IRoom";

type Props = {
  votesCasted?: IUserDetails[];
  room: IRoom;
};

function VotingResult(props: Props) {
  const user = useContext(userContext);
  const { votesCasted, room } = props;

  return (
    <Grid>
      {votesCasted?.map((v, i) => (
        <Grid
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}
          key={i}
        >
          <Grid> {room.roomId === user!.currentRoomId && v.name}</Grid>
          <Grid sx={{ mx: 2 }} key={i}>
            {v.currentVote}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default VotingResult;
