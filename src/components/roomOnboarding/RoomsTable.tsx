import React from "react";
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

type Props = {
  allRooms: IRoom[];
};

function RoomsTable(props: Props) {
  const navigate = useNavigate();
  const { allRooms } = props;

  const handleJoinRoom = async (roomDetails: IRoom) => {
    localStorage.setItem("room", JSON.stringify(roomDetails));
    navigate(`/room/${roomDetails.roomId}`);
    //HACK: used to reconnect user on joining room
    window.location.reload();
  };

  return (
    <TableContainer
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center"
      }}
      component={Paper}
    >
      <Grid>
        <Button
          variant="contained"
          disabled={true}
          sx={[
            {
              mt: 4,
              ml: { md: 5, xs: 0 },
              background: "primary.main",
              color: "white",
              px: { md: 4, xs: 2 },
              py: { md: 0.7, xs: 0.5 },
              fontSize: "20px"
            },
            {
              "&:hover": {
                color: "white",
                opacity: "0.6"
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
                {/* <Link
                  to={`/room/${row.roomId}`}
                  onClick={() => handleJoinRoom(row)}
                > */}
                <Button
                  variant="contained"
                  onClick={() => handleJoinRoom(row)}
                  sx={[
                    {
                      background: "primary.main",
                      color: "white",
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
