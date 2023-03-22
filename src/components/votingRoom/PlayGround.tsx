import React, { useState, useEffect } from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    position: "relative",
    width: 600,
    height: 400,
    margin: "auto",
    display: "flex",
    flexDirection: "column",
    background: "purple",

    justifyContent: "center",
    alignItems: "center",
    marginTop: "300px"
  },
  container: {
    position: "relative",
    width: 500,
    height: 300,
    border: "2px solid red"
  },
  card: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: "50%",
    background: "orange",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white"
  }
});

interface CardPositions {
  [key: string]: { top: number; left: number };
}

function PlayGround() {
  const classes = useStyles();

  const [users, setUsers] = useState<any>([]);
  const [cardPositions, setCardPositions] = useState<CardPositions>({});

  useEffect(() => {
    // Code to fetch and set the users state
    const users = [
      { name: "John Doe", age: 32 },
      { name: "Jane Smith", age: 25 },
      { name: "Tom Williams", age: 45 },
      { name: "Mary Johnson", age: 28 },
      { name: "Alex Brown", age: 19 }
    ];
    setUsers(users);
  }, []);

  useEffect(() => {
    const generateCardPositions = (
      numCards: number,
      radius: number,
      centerX: number,
      centerY: number
    ) => {
      const positions: CardPositions = {};
      for (let i = 0; i < numCards; i++) {
        const angle = (i / (numCards / 2)) * Math.PI;
        const x = Math.floor(centerX + radius * Math.cos(angle)) - 50;
        const y = Math.floor(centerY + radius * Math.sin(angle)) - 50;
        positions[`card-${i}`] = { top: y, left: x };
      }
      return positions;
    };

    const numCards = users.length;
    const radius = 200;
    const centerX = 250;
    const centerY = 150;

    const positions = generateCardPositions(numCards, radius, centerX, centerY);
    setCardPositions(positions);
  }, [users]);

  return (
    <div className={classes.root}>
      <div className={classes.container}>
        {/* Rectangular div with red border */}
      </div>
      {users.map(
        (
          user: {
            name:
              | boolean
              | React.ReactChild
              | React.ReactFragment
              | React.ReactPortal
              | null
              | undefined;
          },
          index: React.Key | null | undefined
        ) => (
          <div
            key={index}
            className={classes.card}
            style={cardPositions[`card-${index}`]}
          >
            {user.name}
          </div>
        )
      )}
    </div>
  );
}

export default PlayGround;
