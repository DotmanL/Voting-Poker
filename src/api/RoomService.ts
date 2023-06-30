import axios from "axios";
import { toast } from "react-toastify";
import { IRoom } from "../interfaces/Room/IRoom";
import { getBaseUrl } from "api";

const route: string = "room";
const apiClient = axios.create({
  baseURL: getBaseUrl(route),
  headers: {
    "Content-Type": "application/json"
  }
});

const getRooms = async (companyName: string) => {
  try {
    const response = await apiClient.get<IRoom[]>(`getRooms/${companyName}`);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const createRoom = async (formData: IRoom) => {
  try {
    const body = JSON.stringify(formData);
    const response = await apiClient.post<IRoom>("createRoom", body);
    toast.success("Room created successfully");
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const getRoomDetails = async (id: string) => {
  try {
    const response = await apiClient.get<IRoom>(`getRoomDetails/${id}`);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const RoomService = {
  createRoom,
  getRooms,
  getRoomDetails
};

export default RoomService;
