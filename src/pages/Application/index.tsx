import React from "react";
import Container from "components/Container";
import { useParams } from "react-router-dom";

const Application = () => {
  const { id } = useParams();

  return <Container>Application: {id}</Container>;
};

export default Application;
