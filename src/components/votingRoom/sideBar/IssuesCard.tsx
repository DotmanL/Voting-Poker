import React, { useRef, useState, useContext } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
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
import RoomUsersService, { RoomUsersUpdate } from "api/RoomUsersService";
import { IssueContext } from "utility/providers/IssuesProvider";
import { useClickAway } from "react-use";
import IssueCardDetails from "./IssueCardDetails";
import IssueStoryPointsModal from "./IssueStoryPointsModal";
import Tooltip from "@mui/material/Tooltip";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import JiraService from "api/JiraService";
import { toast } from "react-toastify";
import Spinner from "components/shared/component/Spinner";
import { IUser } from "interfaces/User/IUser";

type Props = {
  room: IRoom;
  id: string;
  index: number;
  issue: IIssue;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  refetchIssues: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<IIssue[] | undefined, Error>>;
  handleDeleteIssue(index: number): Promise<void>;
  handleNewVotingSession?: () => Promise<void>;
  socket: any;
  currentUser: IUser | undefined;
  setIsJiraErrorManagementModalOpen: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setIsInvalidStoryPointsField: React.Dispatch<React.SetStateAction<boolean>>;
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
    issue,
    socket,
    refetchIssues,
    currentUser,
    moveCard,
    id,
    handleDeleteIssue,
    setIsJiraErrorManagementModalOpen,
    setIsInvalidStoryPointsField
  } = props;
  const ref = useRef<HTMLDivElement>(null);
  const { activeIssue, setActiveIssue } = useContext(IssueContext);
  const [isCardDetailsOpen, setIsCardDetailsOpen] = useState<boolean>(false);
  const [isStoryPointsDropDownOpen, setIsStoryPointsDropDownOpen] =
    useState<boolean>(false);
  const [isAddingStoryPoints, setIsAddingStoryPoints] =
    useState<boolean>(false);

  const cardValues = CardType(room.votingSystem);
  const storyPointsDropDownRef = useRef<HTMLDivElement>(null);

  useClickAway(storyPointsDropDownRef, () => {
    setIsStoryPointsDropDownOpen(false);
  });

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

  async function selectActiveCard(issue: IIssue, issueId: string) {
    if (!socket) return;
    if (activeIssue?._id === issueId) {
      socket.emit("isActiveCard", {
        isActiveCardSelected: false,
        roomId: room.roomId
      });
      const roomUsersUpdate: RoomUsersUpdate = {
        activeIssueId: ""
      };
      await RoomUsersService.updateRoomUsers(room.roomId, roomUsersUpdate);
      setActiveIssue(undefined);
    } else {
      socket.emit("isActiveCard", {
        isActiveCardSelected: true,
        roomId: room.roomId,
        activeIssueId: issueId
      });
      const roomUsersUpdate: RoomUsersUpdate = {
        activeIssueId: issueId!
      };
      await RoomUsersService.updateRoomUsers(room.roomId, roomUsersUpdate);
      setActiveIssue(issue);
    }
  }

  async function handleAddStoryPoints(cardValue: number | string) {
    function storyPointValue() {
      if (cardValue === "?") {
        return 0;
      } else {
        return cardValue as number;
      }
    }
    const issueToUpdate = {
      ...issue,
      storyPoints: storyPointValue()
    };

    const response = await IssueService.updateIssue(id, issueToUpdate);
    if (response) {
      refetchIssues();
      setIsStoryPointsDropDownOpen(false);
    }
  }

  const handleClickVoteButton = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    issue: IIssue,
    issueId: string
  ) => {
    selectActiveCard(issue, issueId);
    event.stopPropagation();
  };

  async function handleSaveToJira(issue: IIssue) {
    if (!issue) {
      return;
    }

    const fieldValue = issue.storyPoints!;

    setIsAddingStoryPoints(true);
    const response = await JiraService.jiraUpdateStoryPoints(
      currentUser?._id!,
      issue.jiraIssueId!,
      fieldValue
    );
    setIsAddingStoryPoints(false);
    if (response?.status === 200) {
      toast.success("Story points added to jira successfully", {
        autoClose: 1000,
        position: "bottom-right"
      });
      setIsInvalidStoryPointsField(false);
      return;
    } else {
      toast.error(
        "Could not add story points to jira, ensure story points field is configured properly",
        { autoClose: 1000, position: "bottom-right" }
      );
      setIsInvalidStoryPointsField(true);
      setIsJiraErrorManagementModalOpen(true);
    }
  }

  async function handleonFormSubmitted(formData: IIssue) {
    await IssueService.updateIssue(issue._id!, formData);
    refetchIssues();
  }

  return (
    <Grid>
      <Grid>
        <IssueCardDetails
          isCardDetailsOpen={isCardDetailsOpen}
          setIsCardDetailsOpen={setIsCardDetailsOpen}
          issue={issue}
          onFormSubmitted={handleonFormSubmitted}
          activeIssue={activeIssue}
          handleClickVoteButton={handleClickVoteButton}
          handleAddStoryPoints={handleAddStoryPoints}
          cardValues={cardValues}
        />
      </Grid>
      <Grid
        ref={ref}
        key={id}
        data-handler-id={handlerId}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          px: 1,
          py: 2,
          m: 0,
          width: { md: "400px", xs: "85vw" },
          height: "auto",
          maxHeight: "215px",
          border: canDrop
            ? "1px solid green"
            : activeIssue?._id === issue._id
            ? "2px solid #67A3EE"
            : "0px solid gray",
          borderRadius: "12px",
          cursor: isDragging ? "grabbing" : "pointer",
          my: "15px",
          opacity: isDragging ? 0 : 1,
          boxShadow: (theme) =>
            theme.palette.mode === "dark"
              ? activeIssue?._id === issue._id
                ? "0px 0px 10px 2px rgba(255, 255, 255, 0.4)"
                : "0px 0px 10px 2px rgba(255, 255, 255, 0.1)"
              : activeIssue?._id === issue._id
              ? "0px 0px 10px 2px rgba(0, 0, 0, 0.4)"
              : "0px 0px 10px 2px rgba(0, 0, 0, 0.1)",
          background: (theme) => theme.palette.secondary.main,
          "&:hover": {
            border: isStoryPointsDropDownOpen ? "" : "1px solid #FFFFFF",
            opacity: isDragging ? 0 : 1
          }
        }}
        onClick={() => setIsCardDetailsOpen(true)}
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
            <Typography variant="h6">
              {issue.name?.length! > 30
                ? issue.name?.slice(0, 30) + "..."
                : issue.name}
            </Typography>
          </Grid>

          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "auto",
              px: 0.5,
              position: "absolute",
              left: "75%",
              zIndex: 400,
              "&:hover": {
                color: "red"
              }
            }}
          >
            {isAddingStoryPoints ? (
              <Spinner fullHeight={false} spinnerType="PuffLoader" size={40} />
            ) : (
              <>
                {!!issue.jiraIssueId &&
                  !!currentUser?.jiraAccessToken &&
                  !!currentUser.storyPointsField && (
                    <Tooltip title="Saves StoryPoint to Jira">
                      <SaveIcon
                        sx={{
                          mx: 0.5,
                          height: "30px",
                          width: "80%",
                          "&:hover": {
                            color: "green"
                          }
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSaveToJira(issue);
                        }}
                      />
                    </Tooltip>
                  )}
              </>
            )}
          </Grid>

          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              width: "auto",
              px: 0.5,
              position: "absolute",
              left: "85%",
              zIndex: 400,
              "&:hover": {
                color: "red"
              }
            }}
          >
            <Tooltip title="Delete Issue">
              <DeleteIcon
                sx={{
                  height: "32px",
                  width: "80%",
                  "&:hover": {
                    color: "red"
                  }
                }}
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteIssue(index);
                }}
              />
            </Tooltip>
          </Grid>
        </Grid>

        <Grid
          sx={{ px: 1, width: "90%", my: 1 }}
          onClick={(event) => event.stopPropagation()}
        >
          <Link
            href={issue.link}
            target="_blank"
            rel="noreferrer"
            sx={{ wordBreak: "break-word", width: "80%" }}
          >
            {issue.link}
          </Link>
        </Grid>

        <Grid sx={{ px: 1, width: "90%", my: 1 }}>
          <Typography
            variant="h6"
            sx={{
              wordBreak: "break-word",
              fontSize: { md: "14px", xs: "14px" }
            }}
          >
            {issue.summary?.length! > 30
              ? issue.summary?.slice(0, 30) + "..."
              : issue.summary}
          </Typography>
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
          <Grid
            onClick={(event) => handleClickVoteButton(event, issue, issue._id!)}
          >
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
              {(activeIssue?._id === issue._id && !issue.storyPoints) ||
              (activeIssue?._id === issue._id && !!issue.storyPoints)
                ? "Voting Now...."
                : activeIssue?._id !== issue._id && !!issue.storyPoints
                ? "Vote Again...."
                : activeIssue?._id !== issue._id && !issue.storyPoints
                ? "Vote this issue"
                : "Vote this issue"}
            </Button>
          </Grid>
          <Grid
            sx={{ display: "flex", flexDirection: "row" }}
            onClick={(event) => event.stopPropagation()}
          >
            <Link
              href={issue.link}
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
            <IssueStoryPointsModal
              issue={issue}
              setIsStoryPointsDropDownOpen={setIsStoryPointsDropDownOpen}
              isStoryPointsDropDownOpen={isStoryPointsDropDownOpen}
              storyPointsDropDownRef={storyPointsDropDownRef}
              handleAddStoryPoints={handleAddStoryPoints}
              cardValues={cardValues}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default IssuesCard;
