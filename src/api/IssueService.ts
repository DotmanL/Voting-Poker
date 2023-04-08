import axios from "axios";
import { toast } from "react-toastify";
import { getBaseUrl } from "api";
import { IIssue } from "interfaces/Issues";

const route: string = "issues";
const apiClient = axios.create({
  baseURL: getBaseUrl(route),
  headers: {
    "Content-Type": "application/json"
  }
});

const createIssues = async (issues: IIssue[]) => {
  try {
    const requestBody = { issues };
    const body = JSON.stringify(requestBody);
    const response = await apiClient.post<IIssue[]>("createIssues", body);
    toast.success("Issues added successfully");
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const getAllIssues = async (roomId: string) => {
  try {
    const response = await apiClient.get<IIssue[]>(`getAllIssues/${roomId}`);
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const updateIssue = async (_id: string, issue: IIssue) => {
  try {
    const body = JSON.stringify(issue);
    const response = await apiClient.put<IIssue[]>(`updateIssue/${_id}`, body);
    toast.success("Issue updated successfully");
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const updateIssueOrder = async (issueId: string, newOrder: number) => {
  try {
    const requestBody = { newOrder };
    const body = JSON.stringify(requestBody);
    const response = await apiClient.put<IIssue[]>(
      `updateIssueOrder/${issueId}`,
      body
    );
    return response.data;
  } catch (err: any) {
    console.error(err.message);
  }
};

const deleteIssues = async (issueIds: string[]) => {
  try {
    const requestBody = { issueIds };
    const body = JSON.stringify(requestBody);
    const response = await apiClient.delete(`deleteIssues`, { data: body });
    if (response.status === 200) {
      toast.success("Issues deleted successfully");
    }
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const IssueService = {
  createIssues,
  getAllIssues,
  updateIssue,
  updateIssueOrder,
  deleteIssues
};

export default IssueService;
