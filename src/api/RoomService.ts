import axios from 'axios';
import { toast } from "react-toastify";
import { IRoom } from '../interfaces/Room/IRoom';

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case 'production':
      url = 'https://votingpokerapi.herokuapp.com/api/room/';
      break;
    case 'development':
    default:
      url = 'http://localhost:4000/api/room/';
  }

  return url;
}

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

const getRooms = async () => {
  const response = await apiClient.get<IRoom[]>('getRooms')
  return response.data
}

const createRoom = async (formData: IRoom) => {
  try {
    const body = JSON.stringify(formData)
    const response = await apiClient.post<IRoom>('createRoom', body);
    toast.success('Room created successfully')
    return response.status
  } catch (err: any) {
    console.error(err.message)
  }
};

const getRoomDetails = async (id: string) => {
  try {
    const response = await apiClient.get<IRoom>(`getRoomDetails/${id}`);
    return response.data
  } catch (err: any) {
    console.error(err.message)
  }
};


export const RoomService = {
  createRoom,
  getRooms,
  getRoomDetails
};

export default RoomService