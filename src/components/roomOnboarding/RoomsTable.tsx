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
import { userContext } from "App";

type Props = {
  allRooms: IRoom[];
};

function RoomsTable(props: Props) {
  const navigate = useNavigate();
  const { allRooms } = props;
  const user = useContext(userContext);

  const handleJoinRoom = async (roomDetails: IRoom) => {
    localStorage.setItem("room", JSON.stringify(roomDetails));
    const roomUsersFormData = {
      userId: user?._id!,
      roomId: roomDetails.roomId!,
      userName: user?.name!
    };
    const roomUsersData = await RoomUsersService.getRoomUsersByRoomId(
      roomDetails.roomId
    );
    const existingRoomUsersData = roomUsersData.find(
      (roomUserData) =>
        roomUserData.roomId === roomDetails.roomId &&
        roomUserData.userId === user?._id!
    );
    if (!!user && !existingRoomUsersData) {
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
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
      }}
      component={Paper}
    >
      <Grid>
        <Button
          variant="outlined"
          disabled={true}
          sx={[
            {
              mt: 4,
              ml: { md: 5, xs: 0 },
              background: (theme) => theme.palette.secondary.main,
              color: "black",
              px: { md: 4, xs: 2 },
              py: { md: 0.7, xs: 0.5 },
              fontSize: "24px"
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
                      color: "secondary.main",
                      fontSize: "14px"
                    },
                    {
                      "&:hover": {
                        color: "white",
                        opacity: "0.6"
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
