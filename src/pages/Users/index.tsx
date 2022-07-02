import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useQuery } from "react-query";
import axios from "axios";
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
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";
import Container from "components/Container";
import { Delete, Search } from "@mui/icons-material";
import { DataGrid, GridColDef, GridSelectionModel } from "@mui/x-data-grid";
import ConfirmDialog from "components/Modals/ConfirmDialog";
// import { users } from "data";
import { SERVER_URL } from "config.keys";
import { UserType } from "types";

enum UserStatus {
  Active = "active",
  Ban = "ban",
  Restrict = "restrict",
}

const Dot: React.FC<{ color: string }> = ({ color }) => {
  return (
    <Box
      sx={{
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: color,
      }}
    />
  );
};

const getUsers = async () => {
  const { data } = await axios.get<UserType[]>(`${SERVER_URL}/api/get-users`);

  return data;
};

const UsersPage = () => {
  const { isLoading, data: users } = useQuery(["users"], getUsers);
  const [rows, setRows] = useState<UserType[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const defaultDialogState = {
    open: false,
    title: "",
    message: "",
  };
  const [openDialog, setOpenDialog] = useState(defaultDialogState);

  const [selectedRows, setSelectedRows] = useState<GridSelectionModel>([]);

  const onStatusChange = (userId: string, status: UserStatus) => {
    const title =
      status === UserStatus.Active
        ? "Are you sure you want to activate this user's account?"
        : status === UserStatus.Ban
        ? "Are you sure you want to ban this user?"
        : "Are you sure you want to restrict this user?";
    const message =
      status === UserStatus.Active
        ? "This user will be able to login to the system."
        : status === UserStatus.Ban
        ? "This user will be unable to login to the system."
        : "This user will be unable to login to the system.";

    setOpenDialog({
      open: true,
      title,
      message,
    });
  };

  const columns: GridColDef<UserType>[] = [
    {
      field: "first_name",
      headerName: "First Name",
      renderCell: ({ row }) =>
        row.first_name || (
          <Typography color="error.main" variant="subtitle2">
            {!row.verified ? "Not Verified" : "Unregistered"}
          </Typography>
        ),
    },
    {
      field: "last_name",
      headerName: "Last Name",
      renderCell: ({ row }) =>
        row.last_name || (
          <Typography color="error.main" variant="subtitle2">
            {!row.verified ? "Not Verified" : "Unregistered"}
          </Typography>
        ),
    },
    {
      field: "email",
      headerName: "Email",
      width: 250,
    },
    {
      field: "mentor",
      headerName: "Mentor",
      width: 100,
      renderCell: (params) => {
        return params.row.is_mentor ? (
          <Check color="success" />
        ) : (
          <Close color="error" />
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params) => {
        return (
          <Select
            value={params.row.status || "active"}
            fullWidth
            sx={{ border: "none", outline: "none" }}
            label="Change Status"
            onChange={(e) =>
              onStatusChange(params.row._id, e.target.value as UserStatus)
            }
          >
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
        );
      },
    },
    {
      field: "View Details",
      headerName: "",
      width: 300,
      renderCell: (params) => {
        return (
          <Button
            variant="outlined"
            color="error"
            sx={{ zIndex: 100 }}
            onClick={() => {
              navigate(`/user/${params.row._id}`);
            }}
          >
            View Details
          </Button>
        );
      },
    },
  ];

  useEffect(() => {
    setRows(users || []);
  }, [users]);

  if (!users) return <div />;

  const onSearch = () => {
    const search = searchRef.current!.value;

    const filteredRows = users.filter((user) => {
      return (
        user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.last_name?.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
      );
    });

    setRows(filteredRows);
  };

  return (
    <Container>
      <Dialog
        open={openDialog.open}
        onClose={() => setOpenDialog(defaultDialogState)}
      >
        <ConfirmDialog
          onClose={() => setOpenDialog(defaultDialogState)}
          onConfirm={() => {
            console.log(selectedRows);
          }}
          title={openDialog.title}
          message={openDialog.message}
        />
      </Dialog>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h3" gutterBottom>
          Users
        </Typography>
        <Stack direction="row" alignItems="center">
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                onChange={(e) => {
                  if (e.target.checked) {
                    setRows(users.filter((user: UserType) => !user.first_name));
                  } else {
                    setRows(users);
                  }
                }}
              />
            }
            label="Unregistered"
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                onChange={(e) => {
                  if (e.target.checked) {
                    setRows(users.filter((user: UserType) => user.is_mentor));
                  } else {
                    setRows(users);
                  }
                }}
              />
            }
            label="Only Mentors"
          />
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
      </Stack>
      <Box mb={2}>
        <DataGrid
          loading={isLoading}
          columns={columns}
          rows={rows}
          autoHeight
          pageSize={5}
          rowsPerPageOptions={[5]}
          onSelectionModelChange={(ids) => setSelectedRows(ids)}
          checkboxSelection
          getRowId={(row) => row._id}
        />
      </Box>
      {selectedRows.length !== 0 && (
        <Button
          onClick={() =>
            setOpenDialog({
              open: true,
              title: "Are you sure?",
              message:
                "These users will be permanently deleted from the database",
            })
          }
          color="error"
          variant="contained"
        >
          Delete <Delete />
        </Button>
      )}
    </Container>
  );
};

export default UsersPage;
