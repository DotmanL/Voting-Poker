import { IBase } from "interfaces/IBase";

export interface IIssue extends IBase {
  link: string;
  name: string;
  summary?: string;
}
