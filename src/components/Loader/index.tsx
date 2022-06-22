import React from "react";
import { TailSpin } from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import { styled } from "@mui/material/styles";

const LoaderWrapper = styled("div")`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingComponent = () => (
  <LoaderWrapper>
    <TailSpin color="#000" height={80} width={80} />
  </LoaderWrapper>
);

export default LoadingComponent;
