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
              minWidth: { md: 64, xs: 50 },
              minHeight: { md: 80, xs: 65 },
              mx: { md: 0.8, xs: 0.8 },
              border: `1.5px solid ${userCardColor}`,
              cursor: "pointer",
              borderRadius: "12px",
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              background: "secondary.main",
              alignItems: "center",
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0 2px 8px rgba(0, 0, 0, 0.3)"
                  : "0 2px 8px rgba(0, 0, 0, 0.08)",
              transition: "all 0.25s ease-in-out"
            },
            {
              "&:hover": {
                borderRadius: "12px",
                transform: "translateY(-6px)",
                backgroundColor: `${userCardColor}`,
                boxShadow: `0 8px 24px ${userCardColor}40`
              }
            }
          ]}
          onClick={() => handleClickCard(cardNumber)}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{
                fontSize: { md: "28px", xs: "20px" },
                fontWeight: 700
              }}
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
