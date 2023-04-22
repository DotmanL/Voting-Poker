import React, { useEffect, useState, useContext } from "react";
import { useQueries } from "react-query";
import { IUser } from "interfaces/User/IUser";
import { Grid } from "@mui/material";
import { IRoom } from "interfaces/Room/IRoom";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { NavBar } from "components/shared/component/NavBar";
import { userContext } from "../../App";
import VotingRoom from "./VotingRoom";
import RoomService from "../../api/RoomService";
import UserService from "../../api/UserService";
import Spinner from "components/shared/component/Spinner";
import RoomUsersService from "api/RoomUsersService";
import { IRoomUsers } from "interfaces/RoomUsers";

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = "https://votingpokerapi.herokuapp.com/";
      // url = "https://dotvoting.onrender.com";
      break;
    case "development":
    default:
      url = "http://localhost:4001";
  }

  return url;
};

const socket = io(getBaseUrl());

function VotingRoomContainer() {
  const getRoomId = useParams();
  const roomId = Object.values(getRoomId)[0];

  async function getRoomDetails() {
    return await RoomService.getRoomDetails(roomId!);
  }

  async function getRoomUsersByRoomId() {
    return await RoomUsersService.getRoomUsersByRoomId(roomId!);
  }

  const queries = useQueries([
    {
      queryKey: "getRoom",
      queryFn: () => getRoomDetails()
    },
    {
      queryKey: "getRoomUsers",
      queryFn: () => getRoomUsersByRoomId()
    }
  ]);

  const roomDetailsQuery = queries[0];
  const roomUsersByRoomIdQuery = queries[1];

  const [roomDetails, setRoomDetails] = useState<IRoom>(roomDetailsQuery.data!);
  const [roomUserDetails, setRoomUserDetails] = useState<IRoomUsers[]>(
    roomUsersByRoomIdQuery.data!
  );
  const user = useContext(userContext);
  const [currentUser, setCurrentUser] = useState<IUser | null>(user);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(!user ? true : false);

  const handleCreateUser = async (formData: IUser) => {
    await UserService.createUser(formData);
    const userByName = await UserService.getCurrentUserByName(formData.name);
    if (!userByName) {
      return;
    }
    localStorage.setItem("userId", JSON.stringify(userByName?._id));
    setCurrentUser(userByName!);
    socket.emit("user", { userByName });
    window.location.reload();
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!!user) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
    setRoomDetails(roomDetailsQuery.data!);
    setRoomUserDetails(roomUsersByRoomIdQuery.data!);
  }, [user, roomDetailsQuery, roomUsersByRoomIdQuery]);

  if (roomDetailsQuery.error) {
    return <p>{(roomDetailsQuery.error as Error)?.message}</p>;
  }

  if (roomUsersByRoomIdQuery.error) {
    return <p>{(roomUsersByRoomIdQuery.error as Error)?.message}</p>;
  }

  return (
    <Grid
      sx={{
        height: "100%",
        backgroundColor: "secondary.main"
      }}
    >
      <NavBar
        appName={roomDetails?.name}
        isBorderBottom={false}
        currentUser={currentUser!}
      />
      {roomDetailsQuery.isLoading && roomUsersByRoomIdQuery.isLoading ? (
        <Spinner />
      ) : (
        <Grid
          sx={{
            height: "100%"
          }}
        >
          {roomDetails && roomUserDetails && (
            <VotingRoom
              room={roomDetails}
              roomUsersData={roomUserDetails}
              socket={socket}
              handleCreateUser={handleCreateUser}
              isModalOpen={isModalOpen}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
}

export default VotingRoomContainer;
