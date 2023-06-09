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

const jiraAuthenticationAutoRefresh = async (userId: string) => {
  try {
    const response = await apiClient.get(`autoRefreshUser/${userId}`);
    return response.status;
  } catch (err: any) {
    console.error(err.message);
  }
};

const jiraAccessibleResources = async (userId: string) => {
  try {
    const response = await apiClient.get(`accessibleResources/${userId}`);
    return response;
  } catch (err: any) {
    console.error(err.message);
  }
};

const jiraBasicSearch = async (
  userId: string,
  jqlQuery: string,
  fields: string[]
) => {
  try {
    const response = await apiClient.get(
      `jiraBasicSearch/${userId}/${jqlQuery}?fields=${fields}`
    );
    return response;
  } catch (err: any) {
    console.error(err.message);
  }
};

const jiraUpdateStoryPoints = async (
  userId: string,
  issueId: string,
  fieldValue: number
) => {
  try {
    const response = await apiClient.get(
      `updateStoryPoints/${userId}/${issueId}?fieldValue=${fieldValue}`
    );
    return response;
  } catch (err: any) {
    console.error(err.message);
  }
};

const jiraProjects = async (userId: string) => {
  try {
    const response = await apiClient.get(`getProjects/${userId}`);
    return response;
  } catch (err: any) {
    console.error(err.message);
  }
};

const jiraIssueTypes = async (userId: string) => {
  try {
    const response = await apiClient.get(`getIssueTypes/${userId}`);
    return response;
  } catch (err: any) {
    console.error(err.message);
  }
};

const jiraFilters = async (userId: string) => {
  try {
    const response = await apiClient.get(`getMyFilters/${userId}`);
    return response;
  } catch (err: any) {
    console.error(err.message);
  }
};

const jiraFields = async (userId: string) => {
  try {
    const response = await apiClient.get(`getFields/${userId}`);
    return response;
  } catch (err: any) {
    console.error(err.message);
  }
};

export const JiraService = {
  jiraAuthentication,
  jiraAuthenticationAutoRefresh,
  jiraAccessibleResources,
  jiraUpdateStoryPoints,
  jiraBasicSearch,
  jiraProjects,
  jiraIssueTypes,
  jiraFilters,
  jiraFields
};

export default JiraService;
