import { IBase } from "interfaces/IBase";
import { RoleType } from "interfaces/enums/RoleEnum";

//TODO: break down
export interface IUser extends IBase {
  name: string;
  currentVote?: number;
  currentRoomId?: string;
  votedState?: boolean;
  isConnected?: boolean;
  jiraAccessToken?: string;
  jiraRefreshToken?: string;
  storyPointsField?: string;
  cardColor?: string;
  role?: RoleType;
}
