import React from 'react';

import { Box, Stack, Typography, Button } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { MeetingType } from 'types';

interface IProps {
  meetings?: MeetingType[];
  loading?: boolean;
}

const columns: GridColDef<MeetingType>[] = [
  {
    field: 'mentee.name',
    headerName: 'Mentee',
    width: 200,
    renderCell: ({ row }) => (
      <Stack>
        <Typography variant="body1">
          {row.mentee.first_name} {row.mentee.last_name}
        </Typography>
        <Typography variant="caption">{row.mentee_email}</Typography>
      </Stack>
    ),
  },
  {
    field: 'mentor.name',
    headerName: 'Mentor',
    width: 200,
    renderCell: ({ row }) => (
      <Stack>
        <Typography variant="body1">
          {row.mentor.first_name} {row.mentor.last_name}
        </Typography>
        <Typography variant="caption">{row.mentor_email}</Typography>
      </Stack>
    ),
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 200,
    renderCell: ({ row }) => (
      <Stack>
        <Typography variant="body1">
          {new Date(row.start_date).toLocaleDateString()}
        </Typography>
        <Typography variant="caption">
          {new Date(row.start_date).toLocaleTimeString()} -{' '}
          {new Date(row.end_date).toLocaleTimeString()}
        </Typography>
      </Stack>
    ),
  },
  {
    field: 'status',
    headerName: 'Status',
  },
  {
    field: 'meetingLink',
    headerName: 'Meeting Link',
    renderCell: ({ row }) => (
      <Button
        variant="contained"
        color="success"
        disabled={!Boolean(row.google_meeting_link)}
        onClick={() => (window.location.pathname = row.google_meeting_link)}>
        Join
      </Button>
    ),
  },
  {
    width: 200,
    field: 'feedback',
    headerName: 'Feedback',
    renderCell: ({ row }) => (
      <Button
        variant="contained"
        color="warning"
        disabled={!Boolean(row.session.rating)}>
        View Feedback
      </Button>
    ),
  },
];

const UserMeetings: React.FC<IProps> = ({ meetings, loading }) => (
  <Box mb={3}>
    <DataGrid
      loading={loading}
      columns={columns}
      rows={meetings || []}
      autoHeight
      pageSize={5}
      rowsPerPageOptions={[5]}
      getRowId={(row) => row._id}
    />
  </Box>
);

export default UserMeetings;
