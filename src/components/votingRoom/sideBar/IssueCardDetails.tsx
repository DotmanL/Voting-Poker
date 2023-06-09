import { Button, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid";
import CustomModal from "components/shared/component/CustomModal";
import { IIssue } from "interfaces/Issues";
import React, { useRef, useState } from "react";
import * as yup from "yup";
import { AiOutlineClose } from "react-icons/ai";
import { handleKeyDown } from "utility/Keydown";
import { useFormik } from "formik";
import TextField from "@mui/material/TextField";
import { useClickAway } from "react-use";
import IssueStoryPointsModal from "./IssueStoryPointsModal";

type Props = {
  isCardDetailsOpen: boolean;
  setIsCardDetailsOpen: (isCardDetailsOpen: boolean) => void;
  onFormSubmitted: (formData: IIssue) => void;
  issue: IIssue;
  activeIssue: IIssue | undefined;
  handleClickVoteButton: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    issue: IIssue,
    issueId: string
  ) => void;
  cardValues: (string | number)[];
  handleAddStoryPoints(cardValue: number | string): Promise<void>;
};

function IssueCardDetails(props: Props) {
  const {
    isCardDetailsOpen,
    setIsCardDetailsOpen,
    issue,
    activeIssue,
    onFormSubmitted,
    handleClickVoteButton,
    cardValues,
    handleAddStoryPoints
  } = props;
  const [activeField, setActiveField] = useState<string>();
  const [isStoryPointsDropDownOpen, setIsStoryPointsDropDownOpen] =
    useState<boolean>(false);

  const formRef = useRef<HTMLDivElement>(null);
  const storyPointsDropDownRef = useRef<HTMLDivElement>(null);

  useClickAway(formRef, () => {
    setActiveField(undefined);
  });

  useClickAway(storyPointsDropDownRef, () => {
    setIsStoryPointsDropDownOpen(false);
  });

  const validationSchema = yup.object().shape({
    name: yup.string().required("Name has to be a string"),
    link: yup.string().url("Invalid URL format"),
    summary: yup.string().nullable()
  });

  const formik = useFormik({
    initialValues: {
      name: issue.name,
      link: issue.link,
      summary: issue.summary
    },

    validationSchema: validationSchema,
    onSubmit: (values, { setSubmitting }) => {
      handleSubmit(values as IIssue, setSubmitting);
    }
  });

  const handleSubmit = (
    values: IIssue,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    onFormSubmitted(values);
    setActiveField(undefined);
    setSubmitting(false);
  };

  return (
    <Grid>
      <CustomModal isOpen={isCardDetailsOpen} size={"md"} modalWidth="50vw">
        <Grid
          sx={{
            diplay: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            px: 2
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
            onClick={() => {
              setIsCardDetailsOpen(!isCardDetailsOpen);
            }}
          >
            <AiOutlineClose size={32} />
          </Grid>

          <Grid
            ref={formRef}
            sx={{
              height: "450px",
              width: "95%",
              diplay: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              mt: 10
            }}
          >
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
                  mb: activeField === "name" ? 4 : 8
                }}
                inputProps={{
                  sx: {
                    height: activeField === "name" ? "60px" : "30px"
                  }
                }}
                id="name"
                name="name"
                label="Issues Name"
                value={formik.values.name}
                onClick={() => setActiveField("name")}
                onChange={(event) => {
                  formik.setFieldValue("name", event.target.value);
                }}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
              />
              {activeField === "name" && (
                <SubmitComponent
                  formik={formik}
                  setActiveField={setActiveField}
                />
              )}
              <TextField
                sx={{
                  width: "90%",
                  mb: activeField === "link" ? 4 : 8
                }}
                inputProps={{
                  sx: {
                    height: activeField === "link" ? "60px" : "30px"
                  }
                }}
                id="link"
                name="link"
                label="Issues Link"
                value={formik.values.link}
                onClick={() => setActiveField("link")}
                onChange={(event) => {
                  formik.setFieldValue("link", event.target.value);
                }}
                error={formik.touched.link && Boolean(formik.errors.link)}
                helperText={formik.touched.link && formik.errors.link}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
              />
              {activeField === "link" && (
                <SubmitComponent
                  formik={formik}
                  setActiveField={setActiveField}
                />
              )}
              <TextField
                sx={{
                  width: "90%",
                  mb: activeField === "summary" ? 4 : 8
                }}
                inputProps={{
                  sx: {
                    height: activeField === "summary" ? "60px" : "30px"
                  }
                }}
                id="summary"
                name="summary"
                multiline
                label="Issues Summary"
                value={formik.values.summary}
                onClick={() => setActiveField("summary")}
                onChange={(event) => {
                  formik.setFieldValue("summary", event.target.value);
                }}
                error={formik.touched.summary && Boolean(formik.errors.summary)}
                helperText={formik.touched.summary && formik.errors.summary}
                onKeyDown={(e) => {
                  handleKeyDown(e);
                }}
              />
              {activeField === "summary" && (
                <SubmitComponent
                  formik={formik}
                  setActiveField={setActiveField}
                />
              )}
            </form>
          </Grid>
          <Grid
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              px: { md: 5, xs: 1 },
              height: "90px",
              mt: activeField === undefined ? 0 : 4
            }}
          >
            <Grid
              onClick={(event) =>
                handleClickVoteButton(event, issue, issue._id!)
              }
            >
              <Button
                variant="contained"
                sx={{
                  px: { md: 2, xs: 1 },
                  py: { md: 1, xs: 0.5 },
                  fontSize: { md: "20px", xs: "12px" },
                  background: (theme) =>
                    theme.palette.mode === "dark" ? "#151e22" : "#67A3EE",
                  border: "0.5px solid #67A3EE",
                  color: "white",
                  "&:hover": {
                    background: "darkGray",
                    opacity: 0.8
                  }
                }}
              >
                {(activeIssue?._id === issue._id && !issue.storyPoints) ||
                (activeIssue?._id === issue._id && !!issue.storyPoints)
                  ? "Voting Now...."
                  : activeIssue?._id !== issue._id && !!issue.storyPoints
                  ? "Vote Again...."
                  : activeIssue?._id !== issue._id && !issue.storyPoints
                  ? "Vote this issue"
                  : "Vote this issue"}
              </Button>
            </Grid>
            <Grid
              ref={storyPointsDropDownRef}
              sx={{ cursor: "pointer" }}
              onClick={() =>
                setIsStoryPointsDropDownOpen(!isStoryPointsDropDownOpen)
              }
            >
              <IssueStoryPointsModal
                issue={issue}
                setIsStoryPointsDropDownOpen={setIsStoryPointsDropDownOpen}
                isStoryPointsDropDownOpen={isStoryPointsDropDownOpen}
                storyPointsDropDownRef={storyPointsDropDownRef}
                handleAddStoryPoints={handleAddStoryPoints}
                cardValues={cardValues}
                storyPointCardStyle={{
                  position: "absolute",
                  left: { md: "22vw", xs: "15vw" },
                  marginTop: { md: "-60px", xs: "-150px" },
                  zIndex: 700
                }}
              />
            </Grid>
          </Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default IssueCardDetails;

type SubmitComponentProps = {
  formik: any;
  setActiveField: React.Dispatch<React.SetStateAction<string | undefined>>;
};

function SubmitComponent(props: SubmitComponentProps) {
  const { setActiveField, formik } = props;
  return (
    <Grid
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        px: { md: 12, xs: 0 },
        mb: 5,
        alignItems: "center",
        width: "100%"
      }}
    >
      <Button
        variant="outlined"
        sx={{ px: { md: 4, xs: 2 }, fontSize: { md: "20px", xs: "12px" } }}
        onClick={() => {
          setActiveField(undefined);
        }}
      >
        Cancel
      </Button>
      <Button
        disabled={formik.isSubmitting}
        color="primary"
        variant="contained"
        type="submit"
        sx={{ px: { md: 4, xs: 2 }, fontSize: { md: "20px", xs: "12px" } }}
      >
        {formik.isSubmitting ? <CircularProgress size={24} /> : `Submit`}
      </Button>
    </Grid>
  );
}
