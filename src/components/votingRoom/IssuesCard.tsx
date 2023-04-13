import React, { useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { BiDotsHorizontal } from "react-icons/bi";
import type { Identifier, XYCoord } from "dnd-core";
import LaunchIcon from "@mui/icons-material/Launch";
import { useDrag, useDrop } from "react-dnd";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { IRoom } from "interfaces/Room/IRoom";
import CardType from "utility/CardType";
import IssueService from "api/IssueService";
import { IIssue } from "interfaces/Issues";
import {
  QueryObserverResult,
  RefetchOptions,
  RefetchQueryFilters
} from "react-query/types/core/types";

type Props = {
  room: IRoom;
  id: string;
  index: number;
  link: string;
  name: string;
  issue: IIssue;
  issues?: IIssue[];
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
  handleDeleteIssue(index: number): Promise<void>;
  handleNewVotingSession?: () => Promise<void>;
  socket: any;
  setActiveCardId: React.Dispatch<React.SetStateAction<string | undefined>>;
  activeCardId: string | undefined;
};

const ItemTypes = {
  CARD: "card"
};

interface DragItem {
  index: number;
  id: string;
  type: string;
}

function IssuesCard(props: Props) {
  const {
    room,
    index,
    link,
    name,
    issue,
    socket,
    setActiveCardId,
    activeCardId,
    refetchIssues,
    moveCard,
    id,
    // handleNewVotingSession,
    handleDeleteIssue
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  // const [activeCardId, setActiveCardId] = useState<string | undefined>("");
  const [isMiniDropDownOpen, setIsMiniDropDownOpen] = useState<boolean>(false);
  const [isStoryPointsDropDownOpen, setIsStoryPointsDropDownOpen] =
    useState<boolean>(false);
  const cardValues = CardType(room.votingSystem);

  const [{ handlerId, canDrop }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null; canDrop: boolean }
  >({
    accept: ItemTypes.CARD,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        canDrop: monitor.canDrop()
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.CARD,
    item: () => {
      return { index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging()
    })
  });
  drag(drop(ref));

  async function selectActiveCard(cardId: string) {
    if (!socket) return;
    if (activeCardId === cardId) {
      socket.emit("isActiveCard", {
        isActiveCardSelected: false,
        roomId: room.roomId
      });
      setActiveCardId("");
    } else {
      socket.emit("isActiveCard", {
        isActiveCardSelected: true,
        roomId: room.roomId,
        activeIssueId: cardId
      });
      setActiveCardId(cardId);
    }
  }

  async function handleAddStoryPoints(cardValue: number) {
    const issueToUpdate = {
      ...issue,
      storyPoints: cardValue
    };
    const response = await IssueService.updateIssue(id, issueToUpdate);
    if (response) {
      refetchIssues();
      setIsStoryPointsDropDownOpen(false);
    }
  }

  return (
    <Grid
      ref={ref}
      key={id}
      data-handler-id={handlerId}
      sx={{
        display: "flex",
        flexDirection: "column",
        px: 1,
        py: 2,
        width: "80%",
        height: "auto",
        border: canDrop
          ? "1px solid green"
          : activeCardId === id
          ? "2px solid #67A3EE"
          : "0px solid gray",
        borderRadius: "12px",
        cursor: isDragging ? "grabbing" : "pointer",
        my: "15px",
        opacity: isDragging ? 0 : 1,
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? activeCardId === id
              ? "0px 0px 10px 2px rgba(255, 255, 255, 0.5)"
              : "0px 0px 10px 2px rgba(255, 255, 255, 0.2)"
            : activeCardId === id
            ? "0px 0px 10px 2px rgba(0, 0, 0, 0.4)"
            : "0px 0px 10px 2px rgba(0, 0, 0, 0.2)",
        background: "secondary.main",
        "&:hover": {
          border: isStoryPointsDropDownOpen ? "" : "1px solid #FFFFFF",
          opacity: isDragging ? 0 : 1
        }
      }}
    >
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          px: 1,
          justifyContent: "space-between"
        }}
      >
        <Grid>
          <Typography variant="h6">{name}</Typography>
        </Grid>

        <Grid>
          <BiDotsHorizontal
            onClick={() => {
              setIsMiniDropDownOpen(!isMiniDropDownOpen);
            }}
            size={20}
          />
        </Grid>
      </Grid>

      <Grid
        sx={{ position: "absolute", right: 55, marginTop: "30px", zIndex: 400 }}
      >
        {isMiniDropDownOpen && (
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              width: "200px",
              height: "auto",
              borderRadius: "10px",
              zIndex: 100,
              py: 2,
              cursor: "pointer",
              background: (theme) => theme.palette.secondary.main,
              boxShadow: (theme) =>
                theme.palette.mode === "dark"
                  ? "0px 0px 10px 2px rgba(255, 255, 255, 0.2)"
                  : "0px 0px 10px 2px rgba(0, 0, 0, 0.2)"
            }}
          >
            <Grid
              sx={{
                px: 2,
                width: "100%",
                background: (theme) => theme.palette.secondary.main,
                "&:hover": {
                  background: "darkGray",
                  color: "black",
                  opacity: 0.8
                }
              }}
              onClick={() => handleDeleteIssue(index)}
            >
              Delete Issue
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid sx={{ px: 1, width: "90%", my: 1 }}>
        <Link
          href={link}
          target="_blank"
          rel="noreferrer"
          sx={{ wordBreak: "break-word" }}
        >
          {link}
        </Link>
      </Grid>
      <Grid
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          px: 1,
          mt: 2
        }}
      >
        <Grid onClick={() => selectActiveCard(id)}>
          <Button
            variant="contained"
            sx={{
              background: (theme) =>
                theme.palette.mode === "dark" ? "#151e22" : "#67A3EE",
              border: "0.5px solid #67A3EE",
              color: "white",
              "&:hover": {
                background: "darkGray",
                opacity: 0.8
              }
            }}
          >
            {activeCardId === id && !!issue.storyPoints
              ? "Voting Now...."
              : activeCardId !== id && !!issue.storyPoints
              ? "Vote Again...."
              : activeCardId !== id && !issue.storyPoints
              ? "Vote this issue"
              : "Vote this issue"}
          </Button>
        </Grid>
        <Grid sx={{ display: "flex", flexDirection: "row" }}>
          <Link
            href={link}
            target="_blank"
            rel="noreferrer"
            sx={{ wordBreak: "break-word" }}
          >
            <LaunchIcon
              sx={{
                mr: "10px",
                "&:hover": {
                  color: "green",
                  opacity: 0.8
                }
              }}
            />
          </Link>

          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              background: "black",
              borderRadius: "50%",
              fontSize: "20px",
              width: "30px",
              height: "30px"
            }}
            onClick={() => {
              setIsStoryPointsDropDownOpen(!isStoryPointsDropDownOpen);
            }}
          >
            {!!issue.storyPoints ? issue.storyPoints : "-"}
          </Grid>
        </Grid>
        <Grid
          sx={{ position: "absolute", marginTop: "30px", marginLeft: "-23px" }}
        >
          {isStoryPointsDropDownOpen && (
            <Grid
              sx={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                width: { md: "320px", xs: "250px" },
                height: { md: "250px", xs: "180px" },
                borderRadius: "10px",
                ml: "-20px",
                zIndex: 700,
                py: 1,
                cursor: "pointer",
                background: (theme) => theme.palette.secondary.main,
                boxShadow: (theme) =>
                  theme.palette.mode === "dark"
                    ? "0px 0px 10px 2px rgba(255, 255, 255, 0.2)"
                    : "0px 0px 10px 2px rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  border: "1px solid #FFFFFF"
                }
              }}
            >
              <Grid
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  flexWrap: "wrap",
                  width: "100%",
                  height: "100%",
                  px: 1,
                  py: 1
                }}
              >
                {cardValues.map((cardValue, index) => (
                  <Grid
                    key={index}
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      background: "black",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      borderRadius: "50%",
                      mx: 0.5,
                      my: 0.2,
                      fontSize: "20px",
                      width: "45px",
                      height: "45px",
                      boxShadow: (theme) =>
                        theme.palette.mode === "dark"
                          ? "0px 0px 10px 2px rgba(255, 255, 255, 0.2)"
                          : "0px 0px 10px 2px rgba(0, 0, 0, 0.2)",
                      "&:hover": {
                        border: "primary.main",
                        opacity: 0.8
                      }
                    }}
                    onClick={() => {
                      handleAddStoryPoints(cardValue);
                    }}
                  >
                    {cardValue}
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </Grid>
  );
}

export default IssuesCard;
