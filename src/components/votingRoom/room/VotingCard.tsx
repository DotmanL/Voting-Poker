import React from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardType from "utility/CardType";

type Props = {
  userCardColor: string;
  votingSystem: number;
  handleClickCard: (value: number | string) => void;
};

function VotingCard(props: Props) {
  const { votingSystem, handleClickCard, userCardColor } = props;

  const cardValues = CardType(votingSystem);

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        height: "auto",
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
              minWidth: { md: 60, xs: 50 },
              minHeight: { md: 80, xs: 60 },
              mx: { md: 1, xs: 1 },
              border: `1px solid ${userCardColor}`,
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
                transform: "translate(0, -5px)",
                backgroundColor: `${userCardColor}`
              }
            }
          ]}
          onClick={() => handleClickCard(cardNumber)}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontSize: { md: "32px", xs: "22px" } }}
            >
              {cardNumber}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Grid>
  );
}

export default VotingCard;
