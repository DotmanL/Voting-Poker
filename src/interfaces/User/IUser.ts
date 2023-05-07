import { IBase } from "interfaces/IBase";

//TODO: break down
export interface IUser extends IBase {
  name: string;
  currentVote?: number;
  currentRoomId?: string;
  votedState?: boolean;
  isConnected?: boolean;
  jiraAccessToken?: string;
}
