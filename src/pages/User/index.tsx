import React from 'react';
import { useParams } from 'react-router';
import { useQuery } from 'react-query';
import axios from 'axios';
import Container from 'components/Container';
import { Stack, Typography } from '@mui/material';
import UserAbout from './UserAbout';
import UserStats from './UserStats';
import UserMeetings from './UserMeetings';
import { MeetingType, MentorSchemaType, StatsType, UserType } from 'types';
import { SERVER_URL } from 'config.keys';
import Loader from 'components/Loader';

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
    },
  );

  return data;
};

const getMentorStats = async (id?: string) => {
  const { data } = await axios.get<StatsType>(
    `${SERVER_URL}/api/get-mentor-stats/${id}`,
  );

  return data;
};

const getUserMeetings = async (id?: string) => {
  const { data } = await axios.get<{ meetings: MeetingType[] }>(
    `${SERVER_URL}/api/get-user-meetings/${id}`,
  );

  return data.meetings;
};

const User = () => {
  const { id } = useParams();
  const { data: user, isLoading: userLoading } = useQuery(['user', id], () =>
    getUser(id),
  );
  const { data: mentorInfo, isLoading: mentorLoading } = useQuery(
    ['mentorInfo', user],
    () => getMentorInfo(user?.mentor_information),
    {
      enabled: user?.is_mentor,
    },
  );
  const statQuery = useQuery(
    ['stats', user?.mentor_information],
    () => getMentorStats(user?.mentor_information),
    {
      enabled: user?.is_mentor,
    },
  );
  const meetingsQuery = useQuery(['meetings', id], () => getUserMeetings(id));

  if (!id) return <div />;
  if (!user) return <div />;

  if (userLoading || mentorLoading) return <Loader />;

  return (
    <Container>
      <Stack spacing={4}>
        <UserAbout user={user} mentorInfo={mentorInfo} />
        {user?.is_mentor && (
          <Stack>
            <Typography variant="h5" color="textSecondary" gutterBottom>
              User Stats
            </Typography>
            <UserStats
              likes={statQuery.data?.likes}
              meetings={statQuery.data?.meetings}
              reports={statQuery.data?.reports}
            />
          </Stack>
        )}
        <Stack>
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Meetings
          </Typography>
          <UserMeetings
            meetings={meetingsQuery.data}
            loading={meetingsQuery.isLoading}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default User;
