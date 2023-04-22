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
type roomUsersUpdate = {
  currentVote?: number;
  activeIssueId?: string;
  votedState?: boolean;
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

const updateRoomUsers = async (
  roomId: string,
  userId: string,
  roomUsersUpdate: roomUsersUpdate
) => {
  try {
    const body = JSON.stringify(roomUsersUpdate);

    const response = await apiClient.put<IRoomUsers>(
      `roomUsers/${roomId}/${userId}`,
      body
    );
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const RoomUsersService = {
  createRoomUsers,
  getRoomUsersByRoomId,
  updateRoomUsers
};

export default RoomUsersService;
