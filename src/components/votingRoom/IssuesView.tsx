import React, { useCallback, useState, useEffect } from "react";
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
  socket: any;
  roomId: string;
  setCards: React.Dispatch<React.SetStateAction<IIssue[]>>;
  cards: IIssue[];
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
};

function IssuesView(props: Props) {
  const { cards, setCards, refetchIssues, socket, roomId } = props;
  const [activeCardId, setActiveCardId] = useState<string>();

  useEffect(() => {
    if (cards) {
      socket.on("orderUpdateResponse", (data: any) => {
        if (data.isOrderUpdated) {
          refetchIssues();
        }
      });
    }
  }, [cards, socket, refetchIssues]);

  const moveCard = useCallback(
    async (dragIndex: number, hoverIndex: number) => {
      setCards((prevCards: IIssue[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as IIssue]
          ]
        })
      );

      const updatedIssues = await IssueService.updateIssueOrder(
        cards[dragIndex]._id!,
        hoverIndex + 1
      );

      const orderedIssues = updatedIssues?.sort((a, b) => a.order! - b.order!);
      setCards(orderedIssues!);

      socket.emit("orderUpdate", { isOrderUpdated: true, roomId: roomId });
    },
    [cards, setCards, socket, roomId]
  );

  const handleDeleteIssue = useCallback(
    async (id: string) => {
      await IssueService.deleteIssues([id]);
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
      {cards
        .sort((a, b) => a.order! - b.order!)
        .map((card, i) => renderCard(card, i))}
    </Grid>
  );
}

export default IssuesView;
