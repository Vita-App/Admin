import React from "react";
import { useParams } from "react-router";
import Container from "components/Container";
import { Stack, Typography } from "@mui/material";
import UserAbout from "./UserAbout";
import UserStats from "./UserStats";
import UserMeetings from "./UserMeetings";

const User = () => {
  const params = useParams();

  console.log("ID: ", params.id);

  return (
    <Container>
      <Stack spacing={4}>
        <UserAbout />
        <Stack>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            User Stats
          </Typography>
          <UserStats />
        </Stack>
        <Stack>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Meetings
          </Typography>
          <UserMeetings />
        </Stack>
      </Stack>
    </Container>
  );
};

export default User;
