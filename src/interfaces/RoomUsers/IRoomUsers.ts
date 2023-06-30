import { IBase } from "../IBase";

export interface IRoomUsers extends IBase {
  userId: string;
  roomId: string;
  userName: string;
  currentVote?: number;
  activeIssueId?: string;
  votedState?: boolean;
  cardColor?: string;
  [key: string]: any;
}
