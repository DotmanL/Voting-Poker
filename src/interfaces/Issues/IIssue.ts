import { IBase } from "interfaces/IBase";

export interface IIssue extends IBase {
  roomId?: string; //update to be required
  link: string;
  name: string;
  summary?: string;
  storyPoints?: number;
  order?: number;
  isVoted?: boolean;
  isActive?: boolean;
  [key: string]: any;
}
