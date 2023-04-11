import React from "react";
import Grid from "@mui/material/Grid";
import * as yup from "yup";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { IIssue } from "interfaces/Issues";
import { useParams } from "react-router-dom";

type Props = {
  onFormSubmitted: (formData: IIssue[]) => void;
  cardsLength: number;
  isSingleIssueTextBoxOpen?: boolean;
  setIsSingleIssueTextBoxOpen: (isSingleIssueTextBoxOpen: boolean) => void;
};

function SingleIssueTextbox(props: Props) {
  const { setIsSingleIssueTextBoxOpen, onFormSubmitted, cardsLength } = props;
  const getRoomId = useParams();

  const validationSchema = yup.object().shape({
    issues: yup.array().of(yup.string().url("Invalid URL format"))
  });

  const handleSubmit = (
    values: string[],
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    let issues: IIssue[] = [];
    let currentOrder = cardsLength + 1;
    for (const url of values) {
      issues.push({
        name: `Ticket ${currentOrder}`,
        link: url,
        order: currentOrder,
        roomId: getRoomId.roomId!
      });
      currentOrder++;
    }
    setSubmitting(true);
    onFormSubmitted(issues);
    setSubmitting(false);
    clearField();
  };

  const formik = useFormik({
    initialValues: {
      issues: []
    },

    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) =>
      handleSubmit(values.issues, setSubmitting)
  });

  const clearField = () => {
    formik.setFieldValue("issues", []);
  };
  return (
    <Grid>
      <Grid>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%"
          }}
        >
          <TextField
            sx={{
              width: "90%",
              mt: 5
            }}
            InputProps={{
              sx: {
                height: "100px",
                width: "100%",
                px: "8px",
                mx: 0
              }
            }}
            id="issues"
            name="issues"
            label="Issue url"
            rows={1}
            value={formik.values.issues.join("\n")}
            onChange={(event) => {
              formik.setFieldValue(
                "issues",
                event.target.value.trim().split("\n")
              );
            }}
            error={formik.touched.issues && Boolean(formik.errors.issues)}
            helperText={formik.touched.issues && formik.errors.issues}
          />
          <Grid
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }}
          >
            <Button
              variant="outlined"
              sx={{ mt: 6, px: 2, fontSize: { md: "20px", xs: "14px" } }}
              onClick={() => {
                setIsSingleIssueTextBoxOpen(false);
                clearField();
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={!formik.values}
              color="primary"
              variant="contained"
              type="submit"
              sx={{ mt: 6, ml: 5, px: 2, fontSize: { md: "20px", xs: "14px" } }}
            >
              {formik.isSubmitting ? <CircularProgress size={24} /> : `Submit`}
            </Button>
          </Grid>
        </form>
      </Grid>
    </Grid>
  );
}

export default SingleIssueTextbox;
