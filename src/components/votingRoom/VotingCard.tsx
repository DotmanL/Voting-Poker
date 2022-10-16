import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { VotingTypes } from "../../interfaces/Room/VotingTypes";

type Props = {
  votingSystem: number;
};

function VotingCard(props: Props) {
  const { votingSystem } = props;

  const cardType = (votingType: VotingTypes): number[] => {
    switch (votingType) {
      case VotingTypes.Fibonnacci:
        return [0, 1, 2, 3, 5, 8, 13, 21];
      case VotingTypes.Random:
        return [0, 4];
    }
  };

  const cardValues = cardType(votingSystem);

  return (
    <Grid sx={{ display: "flex", flexDirection: "row", mx: 2 }}>
      {cardValues.map((cardNumber, i) => (
        <Card
          key={i}
          variant="outlined"
          sx={[
            {
              minWidth: 160,
              minHeight: 250,
              m: 1,
              border: "1px solid #67A3EE",
              cursor: "pointer",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: 20
            },
            {
              "&:hover": {
                opacity: "0.6"
              }
            }
          ]}
        >
          <CardContent>
            <Typography>{cardNumber} </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}

export default VotingCard;
