import { RoleType } from "interfaces/enums/RoleEnum";
import { IBase } from "../IBase";

export interface IRoomUsers extends IBase {
  userId: string;
  roomId: string;
  userName: string;
  currentVote?: number;
  activeIssueId?: string;
  votedState?: boolean;
  cardColor?: string;
  role?: RoleType;
  [key: string]: any;
}
