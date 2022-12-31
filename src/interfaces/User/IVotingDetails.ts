import { IBase } from "interfaces/IBase";

export interface IVotingDetails extends IBase {
  vote: number;
  userName?: string;
  roomId: string;
  sessionId: string;
  socketId: string;
}
