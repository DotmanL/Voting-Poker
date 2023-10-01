import axios from "axios";
import { IRoomUsers } from "interfaces/RoomUsers";
import { getBaseUrl } from "api";
import {
  IRoomMessage,
  IUserMessage
} from "interfaces/RoomMessages/IRoomMessage";
import { toast } from "react-toastify";

const route: string = "roomMessages";
const apiClient = axios.create({
  baseURL: getBaseUrl(route),
  headers: {
    "Content-Type": "application/json"
  }
});

const createOrUpdateRoomMessage = async (formData: IRoomMessage) => {
  try {
    const body = JSON.stringify(formData);
    const response = await apiClient.post<IRoomUsers>(
      "createOrUpdateRoomMessage",
      body
    );
    return response.status;
  } catch (err: any) {
    toast.error(err.message);
    console.error(err.message);
  }
};

const getRoomMessages = async (roomId: string) => {
  const response = await apiClient.get<IUserMessage[]>(
    `getRoomMessages/${roomId}`
  );
  return response.data;
};

export const RoomMessageService = {
  createOrUpdateRoomMessage,
  getRoomMessages
};

export default RoomMessageService;
