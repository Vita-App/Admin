import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from 'react-query';
import axios from 'axios';
import {
  Box,
  Typography,
  Button,
  Stack,
  TextField,
  IconButton,
  Dialog,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Avatar,
} from '@mui/material';
import { Check, Close } from '@mui/icons-material';
import Container from 'components/Container';
import { Search } from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ConfirmDialog from 'components/Modals/ConfirmDialog';
import { SERVER_URL } from 'config.keys';
import { UserType } from 'types';
import { useRecoilState } from 'recoil';
import { filterOptionsState, usersTableState } from 'store';

enum UserStatus {
  Active = 'active',
  Ban = 'ban',
  Restrict = 'restrict',
}

const Dot: React.FC<{ color: string }> = ({ color }) => (
  <Box
    sx={{
      width: '10px',
      height: '10px',
      borderRadius: '50%',
      backgroundColor: color,
    }}
  />
);

const getUsers = async () => {
  const { data } = await axios.get<UserType[]>(`${SERVER_URL}/api/get-users`);

  return data;
};

const UsersPage = () => {
  const { isLoading, data: users } = useQuery(['users'], getUsers);
  const [filters, setFilters] = useRecoilState(filterOptionsState);
  const [tableState, setTableState] = useRecoilState(usersTableState);
  const [rows, setRows] = useState<UserType[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const defaultDialogState = {
    open: false,
    title: '',
    message: '',
  };
  const [openDialog, setOpenDialog] = useState(defaultDialogState);

  const onStatusChange = (userId: string, status: UserStatus) => {
    const title =
      status === UserStatus.Active
        ? "Are you sure you want to activate this user's account?"
        : status === UserStatus.Ban
        ? 'Are you sure you want to ban this user?'
        : 'Are you sure you want to restrict this user?';
    const message =
      status === UserStatus.Active
        ? 'This user will be able to login to the system.'
        : status === UserStatus.Ban
        ? 'This user will be unable to login to the system.'
        : 'This user will be unable to login to the system.';

    setOpenDialog({
      open: true,
      title,
      message,
    });
  };

  const columns: GridColDef<UserType>[] = [
    {
      field: 'avatar',
      headerName: '',
      width: 50,
      renderCell: ({ row }) => (
        <Avatar
          src={row.avatar?.url || ''}
          alt={row.first_name}
          sx={{
            width: '30px',
            height: '30px',
          }}
        />
      ),
    },
    {
      field: 'first_name',
      headerName: 'First Name',
      renderCell: ({ row }) =>
        row.first_name || (
          <Typography color="error.main" variant="subtitle2">
            {!row.verified ? 'Not Verified' : '_'}
          </Typography>
        ),
    },
    {
      field: 'last_name',
      headerName: 'Last Name',
      renderCell: ({ row }) =>
        row.last_name || (
          <Typography color="error.main" variant="subtitle2">
            {!row.verified ? 'Not Verified' : '_'}
          </Typography>
        ),
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 250,
    },
    {
      field: 'signup_completed',
      headerName: 'Signup Completed',
      width: 180,
      renderCell: (params) =>
        params.row.signup_completed ? (
          <Check color="success" />
        ) : (
          <Close color="error" />
        ),
    },
    {
      field: 'mentor',
      headerName: 'Mentor',
      width: 100,
      renderCell: (params) =>
        params.row.is_mentor ? (
          <Check color="success" />
        ) : (
          <Close color="error" />
        ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      renderCell: (params) => (
        <Select
          value={params.row.status || 'active'}
          fullWidth
          sx={{ border: 'none', outline: 'none' }}
          label="Change Status"
          onChange={(e) =>
            onStatusChange(params.row._id, e.target.value as UserStatus)
          }>
          <MenuItem value="active">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Active</Typography>
              <Dot color="green" />
            </Stack>
          </MenuItem>
          <MenuItem value="ban">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Ban</Typography>
              <Dot color="red" />
            </Stack>
          </MenuItem>
          <MenuItem value="restrict">
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography>Restrict</Typography>
              <Dot color="orange" />
            </Stack>
          </MenuItem>
        </Select>
      ),
    },
    {
      field: 'View Details',
      headerName: '',
      width: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          color="error"
          sx={{ zIndex: 100 }}
          onClick={() => {
            navigate(`/user/${params.row._id}`);
          }}>
          View Details
        </Button>
      ),
    },
  ];

  const applyFilters = (fetchedUsers: UserType[]) => {
    let filteredRows = fetchedUsers;

    const {
      search,
      topMentors,
      unapprovedMentors,
      onlyMentors,
      signupIncomplete,
    } = filters;

    if (search) {
      filteredRows = fetchedUsers.filter(
        (user) =>
          user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
          user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.experiences?.some((exp) =>
            exp.company.toLowerCase().includes(search.toLowerCase()),
          ) ||
          user.experiences?.some((exp) =>
            exp.role.toLowerCase().includes(search.toLowerCase()),
          ),
      );
    }

    if (onlyMentors) {
      filteredRows = filteredRows.filter((user) => user.is_mentor);
    }

    if (topMentors) {
      filteredRows = filteredRows.filter((user) => user.top_mentor);
    }

    if (unapprovedMentors) {
      filteredRows = filteredRows.filter(
        (user) => user.is_mentor && !user.approved && user.signup_completed,
      );
    }

    if (signupIncomplete) {
      filteredRows = filteredRows.filter((user) => !user.signup_completed);
    }

    return filteredRows;
  };

  useEffect(() => {
    setRows(applyFilters(users || []));
  }, [users]);

  useEffect(() => {
    setRows(applyFilters(users || []));
  }, [filters]);

  if (!users) return <div />;

  return (
    <Container>
      <Dialog
        open={openDialog.open}
        onClose={() => setOpenDialog(defaultDialogState)}>
        <ConfirmDialog
          onClose={() => setOpenDialog(defaultDialogState)}
          onConfirm={() => setOpenDialog(defaultDialogState)}
          title={openDialog.title}
          message={openDialog.message}
        />
      </Dialog>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mb={2}>
        <Typography variant="h3" gutterBottom>
          Users
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={filters.signupIncomplete}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    signupIncomplete: e.target.checked,
                    topMentors: e.target.checked ? false : prev.topMentors,
                    unapprovedMentors: e.target.checked
                      ? false
                      : prev.unapprovedMentors,
                  }));
                }}
              />
            }
            label="Signup incomplete"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={filters.onlyMentors}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    onlyMentors: e.target.checked,
                  }));
                }}
              />
            }
            label="Only Mentors"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={filters.unapprovedMentors}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    unapprovedMentors: e.target.checked,
                    onlyMentors: e.target.checked ? true : prev.onlyMentors,
                    topMentors: e.target.checked ? false : prev.topMentors,
                    signupIncomplete: e.target.checked
                      ? false
                      : prev.signupIncomplete,
                  }));
                }}
              />
            }
            label="Unapproved Mentors"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={filters.topMentors}
                onChange={(e) => {
                  setFilters((prev) => ({
                    ...prev,
                    topMentors: e.target.checked,
                    unapprovedMentors: e.target.checked
                      ? false
                      : prev.unapprovedMentors,
                    signupIncomplete: e.target.checked
                      ? false
                      : prev.signupIncomplete,
                    onlyMentors: e.target.checked ? true : prev.onlyMentors,
                  }));
                }}
              />
            }
            label="Top Mentors"
          />
          <TextField
            inputRef={searchRef}
            label="Search"
            variant="outlined"
            size="small"
            value={filters.search}
            onChange={(e) => {
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }));
            }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => {
                    setFilters((prev) => ({
                      ...prev,
                      search: searchRef.current?.value || '',
                    }));
                  }}>
                  <Search />
                </IconButton>
              ),
            }}
          />
        </Stack>
      </Stack>
      <Box mb={2}>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rows={rows}
          autoHeight
          page={tableState.page}
          pageSize={tableState.pageSize}
          onPageSizeChange={(newPageSize) =>
            setTableState((prev) => ({ ...prev, pageSize: newPageSize }))
          }
          onPageChange={(newPage) =>
            setTableState((prev) => ({ ...prev, page: newPage }))
          }
          rowsPerPageOptions={[5, 10, 20]}
          getRowId={(row) => row._id}
        />
      </Box>
    </Container>
  );
};

export default UsersPage;
