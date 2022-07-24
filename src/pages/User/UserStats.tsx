import React from 'react';
import { Stack, Typography, Avatar, Card, Box, Skeleton } from '@mui/material';
import { Report, Favorite, Videocam } from '@mui/icons-material';

interface IProps {
  likes?: number;
  reports?: number;
  meetings?: number;
}
4;

interface IStatProps {
  icon: React.ReactElement;
  label: string;
  stat?: number;
}

const Stat: React.FC<IStatProps> = ({ icon, label, stat }) => (
  <Card sx={{ p: 2, bgcolor: 'transparent' }}>
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar sx={{ bgcolor: '#ddd' }}>{icon}</Avatar>
      <Box>
        <Typography variant="body2" color="textSecondary">
          {label}
        </Typography>
        <Typography variant="body1" fontWeight={700}>
          {stat !== undefined ? stat : <Skeleton variant="text" />}
        </Typography>
      </Box>
    </Stack>
  </Card>
);

const UserStats: React.FC<IProps> = ({ likes, reports, meetings }) => (
  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
    <Stat icon={<Favorite color="error" />} stat={likes} label="Total Hearts" />
    <Stat
      icon={<Videocam color="success" />}
      stat={meetings}
      label="Total Meetings"
    />
    <Stat
      icon={<Report color="error" />}
      stat={reports}
      label="No Shows/Reports"
    />
  </Stack>
);

export default UserStats;
