import React, { useCallback, useContext, useEffect } from "react";
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
import { IRoom } from "interfaces/Room/IRoom";
import { IssueContext } from "utility/providers/IssuesProvider";

type Props = {
  socket: any;
  room: IRoom;
  setCards: React.Dispatch<React.SetStateAction<IIssue[]>>;
  cards: IIssue[];
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
  handleNewVotingSession: () => Promise<void>;
};

function IssuesView(props: Props) {
  const {
    cards,
    setCards,
    refetchIssues,
    socket,
    room,
    handleNewVotingSession
  } = props;
  const { activeIssue, setActiveIssue } = useContext(IssueContext);

  useEffect(() => {
    if (!socket) return;
    if (cards) {
      socket.on("orderUpdateResponse", (data: any) => {
        if (data.isOrderUpdated) {
          refetchIssues();
        }
      });
    }
    socket.on("triggerRefetchIssuesResponse", (data: any) => {
      if (data.isRefetchIssues) {
        refetchIssues();
      } else {
        return;
      }
    });
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

      socket.emit("orderUpdate", { isOrderUpdated: true, roomId: room.roomId });
    },
    [cards, setCards, socket, room]
  );

  const handleDeleteIssue = async (index: number) => {
    if (cards[index]._id! === activeIssue?._id!) {
      socket.emit("updateActiveIssueId", {
        roomActiveIssueId: "",
        roomId: room.roomId
      });
      setActiveIssue(undefined);
    }
    await IssueService.deleteIssues([cards[index]._id!]);
    socket.emit("triggerRefetchIssues", {
      isRefetchIssues: true,
      roomId: room.roomId
    });
  };

  const renderCard = (card: IIssue, index: number) => {
    return (
      <IssuesCard
        key={card._id!}
        id={card._id!}
        issue={card}
        index={index}
        socket={socket}
        refetchIssues={refetchIssues}
        room={room}
        moveCard={moveCard}
        handleDeleteIssue={handleDeleteIssue}
        handleNewVotingSession={handleNewVotingSession}
      />
    );
  };

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
