import React from "react";
import { useParams } from "react-router";
import Container from "components/Container";

const User = () => {
  const params = useParams();
  return <Container>User ID: {params.id}</Container>;
};

export default User;
