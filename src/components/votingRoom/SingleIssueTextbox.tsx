import React, { useCallback } from "react";
import Grid from "@mui/material/Grid";
import * as yup from "yup";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { IIssue } from "interfaces/Issues";

type Props = {
  isSingleIssueTextBoxOpen?: boolean;
  setIsSingleIssueTextBoxOpen: (isSingleIssueTextBoxOpen: boolean) => void;
};

function SingleIssueTextbox(props: Props) {
  const { setIsSingleIssueTextBoxOpen } = props;
  const validationSchema = yup.object().shape({
    issues: yup.array().of(yup.string().url("Invalid URL format"))
  });

  const handleSubmit = useCallback(
    (values: string[], setSubmitting: (isSubmitting: boolean) => void) => {
      const firstObject = values.slice(0, 1);
      const objects: IIssue[] = firstObject.map((url: string, index) => ({
        name: `Name ${index + 1}`,
        link: url
      }));

      console.log(objects);

      //   onFormSubmitted(values);
      setSubmitting(false);
    },
    // [onFormSubmitted]
    []
  );

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
            multiline
            rows={2}
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
              sx={{ mt: 6, px: 4, fontSize: "20px" }}
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
              sx={{ mt: 6, ml: 5, px: 4, fontSize: "20px" }}
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
