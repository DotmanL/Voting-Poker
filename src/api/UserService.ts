import axios from "axios";
import { toast } from "react-toastify";
import { IUser } from "../interfaces/User/IUser";
import { getBaseUrl } from "api";
import { IUserDetails } from "interfaces/User/IUserDetails";

const route: string = "user";
const apiClient = axios.create({
  baseURL: getBaseUrl(route),
  headers: {
    "Content-Type": "application/json"
  }
});

const createUser = async (formData: IUser) => {
  try {
    const body = JSON.stringify(formData);
    const response = await apiClient.post<IUser>("createuser", body);
    toast.success("User created successfully");
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const getCurrentUserByName = async (name: string) => {
  try {
    const response = await apiClient.get<IUser>(`getCurrentUserByName/${name}`);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const loadUser = async (_id: string) => {
  try {
    const response = await apiClient.get<IUser>(`loadUser/${_id}`);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const getRoomUsers = async (roomId: string) => {
  try {
    const response = await apiClient.get<IUserDetails[]>(
      `usersByRoom/${roomId}`
    );
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const updateUser = async (_id: string, userData: IUser) => {
  try {
    const body = JSON.stringify(userData);
    const response = await apiClient.put<IUser[]>(`updateUser/${_id}`, body);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const resetVote = async (_id: string) => {
  try {
    const response = await apiClient.put(`resetVote/${_id}`);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const deleteUser = async (_id: string | undefined) => {
  try {
    const response = await apiClient.delete<IUser>(`deleteUser/${_id}`);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const UserService = {
  createUser,
  getCurrentUserByName,
  loadUser,
  getRoomUsers,
  updateUser,
  resetVote,
  deleteUser
};

export default UserService;
