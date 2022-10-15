import React, { CSSProperties } from "react";
import RingLoader from "react-spinners/RingLoader";

const override: CSSProperties = {
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  marginTop: "auto",
  marginBottom: "auto"
};

const Spinner: React.FC = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "row",
      justifyContent: "center",
      height: "100vh"
    }}
  >
    <RingLoader cssOverride={override} size={100} color="#67A3EE" />
  </div>
);

export default Spinner;
