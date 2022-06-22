import React, { useState } from "react";

import {
  Card,
  Stack,
  Box,
  Typography,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";

import {
  Close,
  Check,
  MoreHoriz,
  Edit,
  Delete,
  ForwardToInbox,
} from "@mui/icons-material";
import { MentorSchemaType, UserType } from "types";

interface Props {
  user: UserType;
  mentorInfo?: MentorSchemaType | null;
}

const UserAbout: React.FC<Props> = ({ user, mentorInfo }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  return (
    <Card
      elevation={1}
      sx={{ bgcolor: "transparent", p: 3, position: "relative" }}
    >
      <IconButton
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          bgcolor: "white",
          zIndex: 10,
        }}
        onClick={(e) => setAnchorEl(e.currentTarget)}
      >
        <MoreHoriz />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Edit color="primary" sx={{ mr: 1 }} /> Edit
        </MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>
          <Delete color="error" sx={{ mr: 1 }} /> Delete
        </MenuItem>
      </Menu>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Box
          flex="1 0 400px"
          maxWidth="400px"
          minHeight="300px"
          maxHeight="400px"
          borderRadius={5}
        >
          <img
            src={
              user.avatar?.url ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="user"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              backgroundPosition: "center",
              borderRadius: 10,
            }}
          />
        </Box>
        <Stack>
          <Typography variant="h4">
            {user.first_name
              ? `${user.first_name} ${user.last_name}`
              : "Unregistered"}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user.email}
          </Typography>
          {user.is_mentor && user.signup_completed && (
            <Typography variant="body1" color="textSecondary">
              {mentorInfo?.experiences[0]?.role} at{" "}
              {mentorInfo?.experiences[0]?.company}
            </Typography>
          )}
          <Stack direction="row" my={1} spacing={1}>
            <Tooltip title={user.verified ? "Verified" : "Not Verified"}>
              <Chip
                icon={user.verified ? <Check /> : <Close />}
                label={user.is_mentor ? "Mentor" : "Mentee"}
                color={user.verified ? "success" : "error"}
                variant="outlined"
              />
            </Tooltip>
            {mentorInfo && mentorInfo.approved && (
              <Tooltip title="Approved">
                <Chip
                  icon={<Check />}
                  label="Approved"
                  color="success"
                  variant="outlined"
                />
              </Tooltip>
            )}
            {mentorInfo && !mentorInfo.approved && (
              <Button variant="contained" color="secondary" size="small">
                Approve?
              </Button>
            )}
            {mentorInfo && !mentorInfo.approved && (
              <Button variant="contained" color="error" size="small">
                Reject?
              </Button>
            )}
          </Stack>
          <Stack direction="row" spacing={1} my={2}>
            <Button variant="outlined" startIcon={<ForwardToInbox />}>
              Send Mail
            </Button>
            <Button variant="contained" color="error" size="small">
              Ban
            </Button>
            <Button variant="contained" color="warning" size="small">
              Restrict
            </Button>
          </Stack>
          <Typography variant="body2">
            {user.bio || "No bio available"}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default UserAbout;
