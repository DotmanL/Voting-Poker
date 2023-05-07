import axios from "axios";
import { getBaseUrl } from "api";

const route: string = "jira";
const apiClient = axios.create({
  baseURL: getBaseUrl(route),
  headers: {
    "Content-Type": "application/json"
  }
});

const jiraAuthentication = async (userId: string, code: string) => {
  try {
    const response = await apiClient.get(`authenticateUser/${userId}/${code}`);
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const JiraService = {
  jiraAuthentication
};

export default JiraService;
