import React, { useCallback, useState } from "react";
import Grid from "@mui/material/Grid";
import { IIssue } from "interfaces/Issues";
import IssuesCard from "./IssuesCard";
import update from "immutability-helper";
import IssueService from "api/IssueService";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters
} from "react-query/types/core/types";

type Props = {
  setCards: React.Dispatch<React.SetStateAction<IIssue[]>>;
  cards: IIssue[];
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
};

function IssuesView(props: Props) {
  const { cards, setCards, refetchIssues } = props;
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

  const handleDeleteIssue = useCallback(
    async (id: string) => {
      await IssueService.deleteIssue(id);
      refetchIssues();
    },
    [refetchIssues]
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
          handleDeleteIssue={handleDeleteIssue}
        />
      );
    },
    [moveCard, activeCardId, handleDeleteIssue]
  );

  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        alignItems: "center"
      }}
    >
      {cards.map((card, i) => renderCard(card, i))}
    </Grid>
  );
}

export default IssuesView;
