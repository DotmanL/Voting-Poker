import { IUser } from "./IUser";

export interface IUserDetails extends IUser {
  roomId: string,
  userId: string;
  socketId: string,
  votedState?: boolean
}