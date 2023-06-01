import axios from "axios";
import { IRoomUsers } from "interfaces/RoomUsers";
import { getBaseUrl } from "api";

const route: string = "roomusers";
const apiClient = axios.create({
  baseURL: getBaseUrl(route),
  headers: {
    "Content-Type": "application/json"
  }
});

export type RoomUserUpdate = {
  currentVote?: number;
  activeIssueId?: string;
  votedState?: boolean;
};

export type RoomUsersUpdate = {
  activeIssueId?: string;
};

const createRoomUsers = async (formData: IRoomUsers) => {
  try {
    const body = JSON.stringify(formData);
    const response = await apiClient.post<IRoomUsers>("createRoomUser", body);
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const getRoomUsersByRoomId = async (roomId: string) => {
  const response = await apiClient.get<IRoomUsers[]>(`roomUsers/${roomId}`);
  return response.data;
};

const updateRoomUser = async (
  roomId: string,
  userId: string,
  roomUserUpdate: RoomUserUpdate
) => {
  try {
    const body = JSON.stringify(roomUserUpdate);

    const response = await apiClient.put<IRoomUsers>(
      `roomUsers/${roomId}/${userId}`,
      body
    );
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const updateRoomUsers = async (
  roomId: string,
  roomUsersUpdate: RoomUsersUpdate
) => {
  try {
    // const requestBody = { activeIssueId };
    // const body = JSON.stringify(requestBody);
    const body = JSON.stringify(roomUsersUpdate);
    const response = await apiClient.put<IRoomUsers>(
      `roomUsers/${roomId}`,
      body
    );
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const resetRoomUserVote = async (
  roomId: string,
  roomUserUpdate: RoomUserUpdate
) => {
  try {
    const body = JSON.stringify(roomUserUpdate);
    const response = await apiClient.put(`resetRoomUserVote/${roomId}`, body);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const RoomUsersService = {
  createRoomUsers,
  getRoomUsersByRoomId,
  updateRoomUser,
  updateRoomUsers,
  resetRoomUserVote
};

export default RoomUsersService;