import React, { CSSProperties } from "react";
import PuffLoader from "react-spinners/PulseLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red"
};

// const override = css`
//   display: flex;
//   flex-direction: row;

//   margin-left: auto;
//   margin-right: auto;
//   margin-top: 50vh;
//   height: 100vh;
//   border-color: #27ae60;
//   @media screen and (max-width: 800px) {
//     margin-top: 40vh;
//   }
// `;
const Spinner: React.FC = () => (
  <div>
    <PuffLoader cssOverride={override} size={100} color="#27AE60" />
  </div>
);

export default Spinner;
