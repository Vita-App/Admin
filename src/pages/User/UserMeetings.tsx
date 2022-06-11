import React from "react";

import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "sno",
    headerName: "S.No",
    width: 100,
  },
  {
    field: "With",
    headerName: "With",
    width: 200,
  },
  {
    field: "Date",
    headerName: "Date",
    width: 200,
  },
  {
    field: "From",
    headerName: "From",
    width: 200,
  },
  {
    field: "To",
    headerName: "To",
    width: 200,
  },
  {
    field: "Status",
    headerName: "Status",
    width: 200,
  },
];

const rows = [
  {
    id: 1,
    sno: 1,
    With: "Jane Smith",
    Date: "11/6/2022",
    From: "12:00 PM",
    To: "12:30 PM",
    Status: "Upcoming",
  },
  {
    id: 2,
    sno: 2,
    With: "John Doe",
    Date: "5/6/2022",
    From: "12:00 PM",
    To: "1:00 PM",
    Status: "Completed",
  },
];

const UserMeetings = () => {
  return (
    <Box mb={3}>
      <DataGrid
        columns={columns}
        rows={rows}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
      />
    </Box>
  );
};

export default UserMeetings;
