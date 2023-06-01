import React from "react";
import Grid from "@mui/material/Grid";
import CustomModal from "components/shared/component/CustomModal";
import * as yup from "yup";
import Typography from "@mui/material/Typography";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { Button, CircularProgress } from "@mui/material";
import { AiOutlineClose } from "react-icons/ai";
import { IIssue } from "interfaces/Issues";
import { useParams } from "react-router-dom";
import { handleKeyDown } from "utility/Keydown";

type Props = {
  cardsLength: number;
  isAddMultipleModalOpen: boolean;
  setIsAddMultipleModalOpen: (isAddMultipleModalOpen: boolean) => void;
  onFormSubmitted: (formData: IIssue[]) => void;
};

function MultipleUrlsModal(props: Props) {
  const {
    isAddMultipleModalOpen,
    setIsAddMultipleModalOpen,
    onFormSubmitted,
    cardsLength
  } = props;
  const getRoomId = useParams();

  const validationSchema = yup.object().shape({
    issues: yup.array().of(yup.string().url("Invalid URL format"))
  });

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
  const issuesLength = formik.values.issues.length;

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
              id="issues"
              name="issues"
              label="Issues url"
              multiline
              rows={20}
              value={formik.values.issues.join("\n")}
              onChange={(event) => {
                formik.setFieldValue(
                  "issues",
                  event.target.value.trim().split("\n")
                );
              }}
              error={formik.touched.issues && Boolean(formik.errors.issues)}
              helperText={formik.touched.issues && formik.errors.issues}
              onKeyDown={(e) => {
                handleKeyDown(e);
              }}
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
                sx={{ mt: 6, ml: 5, px: 4, fontSize: "20px" }}
              >
                {formik.isSubmitting ? (
                  <CircularProgress size={24} />
                ) : (
                  `Submit ${issuesLength > 0 ? issuesLength : ""} ${
                    issuesLength > 1 ? "links" : "link"
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
