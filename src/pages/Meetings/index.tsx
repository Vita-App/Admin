import React, { useEffect, useRef, useState } from 'react';
import Container from 'components/Container';
import {
  Box,
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { MeetingType } from 'types';
import axios from 'axios';
import { SERVER_URL } from 'config.keys';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

const getMeetings = async () => {
  const { data } = await axios.get<{ meetings: MeetingType[] }>(
    `${SERVER_URL}/api/get-all-meetings`,
  );

  return data.meetings;
};

const MeetingsPage = () => {
  const { isLoading, data: meetings } = useQuery(['meetings'], getMeetings);
  const [rows, setRows] = useState<MeetingType[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRows(meetings || []);
  }, [meetings]);

  if (!meetings)
    return (
      <Container>
        <Typography variant="h4">No Bookings Yet!</Typography>
      </Container>
    );

  const onSearch = () => {
    const search = searchRef.current!.value;

    const filteredRows = meetings.filter((meeting) => {
      const mentee = `${meeting.mentee.first_name} ${meeting.mentee.last_name}`;
      const metor = `${meeting.mentor.first_name} ${meeting.mentor.last_name}`;

      return (
        mentee.toLowerCase().includes(search.toLowerCase()) ||
        metor.toLowerCase().includes(search.toLowerCase())
      );
    });

    setRows(filteredRows);
  };

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

  return (
    <Container>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mb={2}>
        <Typography variant="h3" gutterBottom>
          Meetings
        </Typography>
        <TextField
          inputRef={searchRef}
          label="Search"
          variant="outlined"
          size="small"
          onChange={onSearch}
          InputProps={{
            endAdornment: (
              <IconButton onClick={onSearch}>
                <Search />
              </IconButton>
            ),
          }}
        />
      </Stack>
      <Box mb={2}>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rows={rows}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          getRowId={(row) => row._id}
        />
      </Box>
    </Container>
  );
};

export default MeetingsPage;
