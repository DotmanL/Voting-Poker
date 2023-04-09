import React, { useRef, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { BiLinkExternal } from "react-icons/bi";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import type { Identifier, XYCoord } from "dnd-core";
import { useDrag, useDrop } from "react-dnd";
import Typography from "@mui/material/Typography";

type Props = {
  id: string;
  index: number;
  link: string;
  name: string;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  activeCardId: string;
  setActiveCardId: React.Dispatch<React.SetStateAction<string | undefined>>;
  handleDeleteIssue(id: string): Promise<void>;
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
    index,
    link,
    name,
    moveCard,
    id,
    setActiveCardId,
    activeCardId,
    handleDeleteIssue
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [isMiniDropDownOpen, setIsMiniDropDownOpen] = useState<boolean>(false);

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
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)",
        background: "secondary.main",
        "&:hover": {
          border: "1px solid #FFFFFF",
          opacity: isDragging ? 0 : 1,
          transition: "box-shadow 0.3s ease-in-out",
          boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
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
              onClick={() => handleDeleteIssue(id)}
            >
              Delete Issue
            </Grid>
          </Grid>
        )}
      </Grid>

      <Grid sx={{ px: 1 }}>{link}</Grid>
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
        <Grid
          onClick={() => {
            activeCardId === id ? setActiveCardId("") : setActiveCardId(id);
          }}
        >
          <Button variant="contained">
            {activeCardId === id ? "Voting...." : "Vote this Issue"}{" "}
          </Button>
        </Grid>
        <Grid>
          <BiLinkExternal style={{ marginRight: "10px" }} size={24} />
          <BsThreeDotsVertical size={24} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default IssuesCard;
