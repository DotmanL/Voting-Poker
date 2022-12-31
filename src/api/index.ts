export const getBaseUrl = (route: string) => {
  let url;
  switch (process.env.NODE_ENV) {
    case "production":
      url = `https://votingpokerapi.herokuapp.com/api/${route}/`;
      break;
    case "development":
    default:
      url = `http://localhost:4001/api/${route}/`;
  }

  return url;
};
