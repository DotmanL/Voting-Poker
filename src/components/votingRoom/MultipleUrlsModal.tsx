import React, { useCallback } from "react";
import Grid from "@mui/material/Grid";
import CustomModal from "components/shared/component/CustomModal";
import * as yup from "yup";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";

type Props = {
  isAddMultipleModalOpen: boolean;
  setIsAddMultipleModalOpen: (isAddMultipleModalOpen: boolean) => void;
};

interface IIssueUrl {
  links: string[];
}

function MultipleUrlsModal(props: Props) {
  const { isAddMultipleModalOpen, setIsAddMultipleModalOpen } = props;
  const validationSchema = yup.object().shape({
    links: yup.array().of(yup.string().url("Invalid URL format"))
  });

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (
      event &&
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Enter" ||
        ((event as React.KeyboardEvent).key === "Shift" &&
          (event as React.KeyboardEvent).key === "Enter"))
    ) {
      event.preventDefault();
      const inputEl = event.target as HTMLInputElement;
      const start = inputEl.selectionStart as number;
      const end = inputEl.selectionEnd as number;
      const value = inputEl.value as string;

      inputEl.value = value.slice(0, start) + "\n" + value.slice(end);
      inputEl.setSelectionRange(start + 1, start + 1);
    } else if (event.key === "Backspace") {
      const inputEl = event.target as HTMLInputElement;
      const start = inputEl.selectionStart as number;
      const end = inputEl.selectionEnd as number;
      const value = inputEl.value as string;

      if (start === end && start !== 0 && value[start - 1] === "\n") {
        event.preventDefault();
        inputEl.setSelectionRange(start - 1, start - 1);
      }
    }
  };

  const handleSubmit = useCallback(
    (values: IIssueUrl, setSubmitting: (isSubmitting: boolean) => void) => {
      console.log(values.links);

      //   onFormSubmitted(values);
      console.log(values);
      setSubmitting(false);
    },
    // [onFormSubmitted]
    []
  );

  const formik = useFormik({
    initialValues: {
      links: []
    },

    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => handleSubmit(values, setSubmitting)
  });

  const clearField = () => {
    formik.setFieldValue("links", []);
  };
  const linksLength = formik.values.links.length;
  return (
    <Grid>
      <CustomModal isOpen={isAddMultipleModalOpen} size="md" modalWidth="800px">
        <Grid
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "80%",
            marginTop: "30px"
          }}
        >
          <Grid
            sx={{
              position: "absolute",
              top: "20px",
              right: "20px",
              cursor: "pointer",
              "&:hover": {
                color: "red"
              }
            }}
            onClick={() => setIsAddMultipleModalOpen(false)}
          >
            <AiOutlineClose size={32} />
          </Grid>
          <Grid
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <Typography variant="h5">
              Add Multiple Urls By Pasting a List of Valid Urls below
            </Typography>
            <Typography variant="h6">
              Ensure each Url is on a seperate line
            </Typography>
          </Grid>

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
                width: "80%",
                mx: 5,
                mt: 5
              }}
              id="links"
              name="links"
              label="Issues urls"
              multiline
              rows={15}
              value={formik.values.links.join("\n")}
              onChange={(event) => {
                formik.setFieldValue(
                  "links",
                  event.target.value.trim().split("\n")
                );
              }}
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
              error={formik.touched.links && Boolean(formik.errors.links)}
              helperText={formik.touched.links && formik.errors.links}
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
                sx={{ mt: 6, fontSize: "20px" }}
                onClick={() => {
                  setIsAddMultipleModalOpen(false);
                  clearField();
                }}
              >
                Cancel
              </Button>
              <Button
                disabled={formik.isSubmitting}
                color="primary"
                variant="contained"
                type="submit"
                sx={{ mt: 6, ml: 5, fontSize: "20px" }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  `Submit ${linksLength > 0 ? linksLength : ""} ${
                    linksLength > 1 ? "links" : "link"
                  } `
                )}
              </Button>
            </Grid>
          </form>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default MultipleUrlsModal;
