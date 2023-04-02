import React from "react";
import Grid from "@mui/material/Grid";
import CustomModal from "components/shared/component/CustomModal";

type Props = {
  isAddMultipleModalOpen: boolean;
  setIsAddMultipleModalOpen: (isAddMultipleModalOpen: boolean) => void;
};

function MultipleUrlsModal(props: Props) {
  const { isAddMultipleModalOpen, setIsAddMultipleModalOpen } = props;
  return (
    <Grid>
      <CustomModal isOpen={isAddMultipleModalOpen}>
        <Grid>
          <Grid>Ola</Grid>
          <Grid onClick={() => setIsAddMultipleModalOpen(false)}>Close</Grid>
        </Grid>
      </CustomModal>
    </Grid>
  );
}

export default MultipleUrlsModal;
