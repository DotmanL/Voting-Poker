import axios from 'axios';
import { IRoom } from '../interfaces/Room/IRoom';

const getBaseUrl = () => {
  let url;
  switch (process.env.NODE_ENV) {
    case 'production':
      url = 'https://dotvoting.onrender.com/api/room/';
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

const createRoom = async (formData: IRoom) => {
  const body = JSON.stringify(formData)
  const response = await apiClient.post<IRoom>('createRoom', body);
  return response.status
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
  getRoomDetails
};

export default RoomService