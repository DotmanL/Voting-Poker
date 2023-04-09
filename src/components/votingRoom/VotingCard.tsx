import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { VotingTypes } from "../../interfaces/Room/VotingTypes";

type Props = {
  votingSystem: number;
  handleClickCard: (value: number) => void;
};

function VotingCard(props: Props) {
  const { votingSystem, handleClickCard } = props;

  const cardType = (votingType: VotingTypes): number[] => {
    switch (votingType) {
      case VotingTypes.Fibonnacci:
        return [0, 0.5, 1, 2, 3, 5, 8, 13, 21];
      case VotingTypes.Random:
        return [0, 4];
    }
  };

  const cardValues = cardType(votingSystem);

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "100%",
        px: { xs: 2 },
        overflowX: { md: "hidden", xs: "scroll" },
        width: { md: "100%", xs: "100vw" }
      }}
    >
      {cardValues.map((cardNumber, i) => (
        <Card
          key={i}
          variant="outlined"
          sx={[
            {
              minWidth: { md: 80, xs: 70 },
              minHeight: { md: 120, xs: 100 },
              mx: { md: 2, xs: 1 },
              border: "1px solid #67A3EE",
              cursor: "pointer",
              borderRadius: { md: "8px", xs: "4px" },
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              background: "secondary.main",
              alignItems: "center",
              boxShadow: 10,
              transition: "transform ease 300ms"
            },
            {
              "&:hover": {
                borderRadius: "8px",
                opacity: "0.9",
                transform: "translate(0, -15px)",
                backgroundColor: "#67A3EE"
              }
            }
          ]}
          onClick={() => handleClickCard(cardNumber)}
        >
          <CardContent>
            <Typography variant="h4">{cardNumber} </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}

export default VotingCard;
