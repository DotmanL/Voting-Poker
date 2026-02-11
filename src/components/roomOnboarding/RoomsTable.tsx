import React, { useContext } from "react";
import { IRoom } from "interfaces/Room/IRoom";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import RoomUsersService from "api/RoomUsersService";
import { UserContext } from "utility/providers/UserProvider";

type Props = {
  allRooms: IRoom[];
};

function RoomsTable(props: Props) {
  const navigate = useNavigate();
  const { allRooms } = props;
  const { currentUser } = useContext(UserContext);

  const handleJoinRoom = async (roomDetails: IRoom) => {
    localStorage.setItem("room", JSON.stringify(roomDetails));
    const roomUsersFormData = {
      userId: currentUser?._id!,
      roomId: roomDetails.roomId!,
      userName: currentUser?.name!
    };
    const roomUsersData = await RoomUsersService.getRoomUsersByRoomId(
      roomDetails.roomId
    );
    const existingRoomUsersData = roomUsersData.find(
      (roomUserData) =>
        roomUserData.roomId === roomDetails.roomId &&
        roomUserData.userId === currentUser?._id!
    );
    if (!!currentUser && !existingRoomUsersData) {
      await RoomUsersService.createRoomUsers(roomUsersFormData);
    }
    navigate(`/room/${roomDetails.roomId}`);
  };

  return (
    <TableContainer
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "secondary.main",
        transition: "box-shadow 0.3s ease-in-out",
        boxShadow: (theme) =>
          theme.palette.mode === "dark"
            ? "0 4px 24px rgba(0, 0, 0, 0.3)"
            : "0 4px 24px rgba(0, 0, 0, 0.08)",
        borderRadius: "16px",
        overflow: "hidden"
      }}
      component={Paper}
    >
      <Grid>
        <Button
          variant="contained"
          sx={[
            {
              mt: 2,
              mb: 1,
              ml: { md: 5, xs: 0 },
              background: (theme) => theme.palette.secondary.main,
              color: (theme) => theme.palette.primary.main,
              px: { md: 4, xs: 2 },
              py: { md: 0.7, xs: 0.5 },
              opacity: 1,
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              "&:hover": {
                opacity: 1
              }
            }
          ]}
        >
          Join Room
        </Button>
      </Grid>
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>No</TableCell>
            <TableCell align="left">Room Name</TableCell>
            <TableCell align="left"> </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allRooms.map((row, i: number) => (
            <TableRow
              key={row.roomId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {i + 1}
              </TableCell>
              <TableCell align="left">{row.name}</TableCell>
              <TableCell align="left">
                <Button
                  variant="contained"
                  onClick={() => handleJoinRoom(row)}
                  sx={[
                    {
                      background: "primary.main",
                      color: (theme) =>
                        theme.palette.mode === "dark" ? "#141a1f" : "#ffffff",
                      fontSize: "13px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      px: 2,
                      py: 0.4,
                      borderRadius: "8px"
                    },
                    {
                      "&:hover": {
                        transform: "translateY(-1px)",
                        boxShadow: "0 2px 8px rgba(91, 147, 217, 0.3)"
                      }
                    }
                  ]}
                >
                  JOIN
                </Button>
                {/* </Link> */}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default RoomsTable;
