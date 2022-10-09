import { IBase } from "./IBase";

export interface IRoom extends IBase {
  name: string;
  votingSystem: string;
}
