import React, { useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import { useQuery } from "react-query";

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
import { SERVER_URL } from "config.keys";
import { useSnackbar } from "notistack";

interface Props {
  user: UserType;
  mentorInfo?: MentorSchemaType | null;
}

const approveMentor = async (id?: string) => {
  if (!id) return;

  const { data } = await axios.put(`${SERVER_URL}/api/approve-mentor`, {
    id,
  });

  return data;
};

const UserAbout: React.FC<Props> = ({ user, mentorInfo }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { isLoading, isError, data, refetch } = useQuery(
    ["approveMentor", mentorInfo?._id],
    () => approveMentor(mentorInfo?._id),
    {
      enabled: false,
    }
  );
  const [approved, setApproved] = useState(mentorInfo?.approved);

  useEffect(() => {
    if (isError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    if (data?.success) {
      setApproved(true);
    }
  }, [data, isError, enqueueSnackbar]);

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
            {mentorInfo && approved && (
              <Tooltip title="Approved">
                <Chip
                  icon={<Check />}
                  label="Approved"
                  color="success"
                  variant="outlined"
                />
              </Tooltip>
            )}
            {mentorInfo && !approved && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => refetch()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <TailSpin width="25px" height="25px" color="#000" />
                ) : (
                  "Approve?"
                )}
              </Button>
            )}
            {mentorInfo && !approved && (
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
