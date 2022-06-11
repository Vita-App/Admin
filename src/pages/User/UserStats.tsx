import React from "react";

import { Stack, Typography, Avatar, Card, Box } from "@mui/material";
import { Report, Favorite, Videocam } from "@mui/icons-material";

const UserStats = () => {
  return (
    <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
      <Card sx={{ p: 2, bgcolor: "transparent" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#ddd" }}>
            <Favorite color="error" />
          </Avatar>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Total Hearts
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              1,000
            </Typography>
          </Box>
        </Stack>
      </Card>
      <Card sx={{ p: 2, bgcolor: "transparent" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#ddd" }}>
            <Videocam color="success" />
          </Avatar>
          <Box>
            <Typography variant="body2" color="textSecondary">
              Total Meetings
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              30
            </Typography>
          </Box>
        </Stack>
      </Card>
      <Card sx={{ p: 2, bgcolor: "transparent" }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar sx={{ bgcolor: "#ddd" }}>
            <Report color="error" />
          </Avatar>
          <Box>
            <Typography variant="body2" color="textSecondary">
              No Shows/Reports
            </Typography>
            <Typography variant="body1" fontWeight={700}>
              2
            </Typography>
          </Box>
        </Stack>
      </Card>
    </Stack>
  );
};

export default UserStats;
