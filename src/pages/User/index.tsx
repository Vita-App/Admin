import React from "react";
import { useParams } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
import Container from "components/Container";
import { Stack, Typography } from "@mui/material";
import UserAbout from "./UserAbout";
import UserStats from "./UserStats";
import UserMeetings from "./UserMeetings";
import { MentorSchemaType, UserType } from "types";
import { SERVER_URL } from "config.keys";

const getUser = async (id?: string) => {
  if (!id) return null;

  const { data } = await axios.get<UserType>(`${SERVER_URL}/api/get-user`, {
    params: {
      id,
    },
  });

  return data;
};

const getMentorInfo = async (id?: string) => {
  if (!id) return null;

  const { data } = await axios.get<MentorSchemaType>(
    `${SERVER_URL}/api/get-mentor`,
    {
      params: {
        id,
      },
    }
  );

  return data;
};

const User = () => {
  const { id } = useParams();
  const { data: user } = useQuery(["user", id], () => getUser(id));
  const { data: mentorInfo } = useQuery(
    ["mentorInfo", user],
    () => getMentorInfo(user?.mentor_information),
    {
      enabled: user?.is_mentor,
    }
  );

  if (!id) return <div />;
  if (!user) return <div />;

  return (
    <Container>
      <Stack spacing={4}>
        <UserAbout user={user} mentorInfo={mentorInfo} />
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
