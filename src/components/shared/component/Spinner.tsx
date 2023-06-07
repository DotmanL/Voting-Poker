import React, { CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";
import PuffLoader from "react-spinners/PuffLoader";

const override: CSSProperties = {
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: "auto",
  marginBottom: "auto"
};

type Props = {
  fullHeight?: boolean;
  spinnerType?: string;
  size?: number;
};

function Spinner(props: Props) {
  const { fullHeight = true, spinnerType = "RingLoader", size = 100 } = props;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        height: fullHeight ? "100vh" : ""
      }}
    >
      {spinnerType === "RingLoader" && (
        <RingLoader cssOverride={override} size={size} color="#67A3EE" />
      )}
      {spinnerType === "PuffLoader" && (
        <PuffLoader cssOverride={override} size={size} color="#67A3EE" />
      )}
    </div>
  );
}

export default Spinner;
