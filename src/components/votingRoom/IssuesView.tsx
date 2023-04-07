import React, { useCallback, useState } from "react";
import Grid from "@mui/material/Grid";
import { IIssue } from "interfaces/Issues";
import IssuesCard from "./IssuesCard";
import update from "immutability-helper";

type Props = {
  issues: IIssue[];
  setCards: React.Dispatch<React.SetStateAction<IIssue[]>>;
  cards: IIssue[];
};

function IssuesView(props: Props) {
  const { cards, setCards } = props;
  const [activeCardId, setActiveCardId] = useState<string>();

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: IIssue[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as IIssue]
          ]
        })
      );

      ///api request here
    },
    [setCards]
  );

  const renderCard = useCallback(
    (card: IIssue, index: number) => {
      return (
        <IssuesCard
          key={card._id}
          id={card._id!}
          index={index}
          name={card.name}
          link={card.link}
          moveCard={moveCard}
          activeCardId={activeCardId!}
          setActiveCardId={setActiveCardId}
        />
      );
    },
    [moveCard, activeCardId]
  );

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {cards.map((card, i) => renderCard(card, i))}
    </Grid>
  );
}

export default IssuesView;
