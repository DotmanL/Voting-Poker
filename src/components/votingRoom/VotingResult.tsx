import React, { useContext } from "react";
import Grid from "@mui/material/Grid";
import { userContext } from "App";
import { IUserDetails } from "interfaces/User/IUserDetails";
import { IRoom } from "interfaces/Room/IRoom";
import Typography from "@mui/material/Typography";

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
            justifyContent: "center",
            mt: 2
          }}
          key={i}
        >
          <Grid>
            <Typography sx={{ fontSize: '25px' }}>
              {room.roomId === user!.currentRoomId && v.name}
            </Typography>
          </Grid>
          <Grid sx={{ mx: 2 }} key={i}>
            <Typography sx={{ fontSize: '25px' }}>
              {v.currentVote}
            </Typography>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default VotingResult;
