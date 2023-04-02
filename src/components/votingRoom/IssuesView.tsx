import React from "react";
import Grid from "@mui/material/Grid";
import { IIssue } from "interfaces/Issues";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { BiLinkExternal } from "react-icons/bi";
import { BiDotsHorizontal } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

type Props = {
  issues: IIssue[];
};

function IssuesView(props: Props) {
  const { issues } = props;
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      {issues.map((issue, i) => (
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            px: 1,
            py: 2,
            width: "80%",
            height: "auto",
            border: "1px solid #67A3EE",
            borderRadius: "12px",
            cursor: "pointer",
            my: "15px",
            background: "#FFFFFF",
            "&:hover": {
              border: "1px solid #FFFFFF",
              opacity: 0.8,
              color: "#000000",
              transition: "box-shadow 0.3s ease-in-out",
              boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.2)"
            }
          }}
          key={i}
        >
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              px: 1,
              justifyContent: "space-between"
            }}
          >
            <Typography variant="h6">{issue.name}</Typography>
            <Grid>
              <BiDotsHorizontal />
            </Grid>
          </Grid>
          <Grid sx={{ px: 1 }}>{issue.link}</Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              px: 1,
              mt: 2
            }}
          >
            <Grid>
              <Button variant="contained">Vote this Issue</Button>
            </Grid>
            <Grid>
              <BiLinkExternal style={{ marginRight: "10px" }} size={24} />
              <BsThreeDotsVertical size={24} />
            </Grid>
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default IssuesView;
