import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import { useQuery } from "react-query";
import ConfirmDialog from "components/Modals/ConfirmDialog";
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
  Dialog,
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

const rejectMentor = async (id?: string) => {
  if (!id) return;

  const { data } = await axios.get(`${SERVER_URL}/api/reject-mentor`, {
    params: {
      id,
    },
  });

  return data;
};

const UserAbout: React.FC<Props> = ({ user, mentorInfo }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {
    isLoading: approveLoading,
    isError: approveError,
    data: approveData,
    refetch: approveRefetch,
  } = useQuery(
    ["approveMentor", mentorInfo?._id],
    () => approveMentor(mentorInfo?._id),
    {
      enabled: false,
    }
  );
  const {
    isLoading: rejectLoading,
    isError: rejectError,
    data: rejectData,
    refetch: rejectRefetch,
  } = useQuery(["rejectMentor", user._id], () => rejectMentor(user._id), {
    enabled: false,
  });
  const [approved, setApproved] = useState(mentorInfo?.approved);

  useEffect(() => {
    if (approveError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    if (approveData?.success) {
      enqueueSnackbar("Email sent to the user!", { variant: "success" });
      setApproved(true);
    }
  }, [approveData, approveError, enqueueSnackbar]);

  useEffect(() => {
    if (rejectError) {
      enqueueSnackbar("Something went wrong!", { variant: "error" });
    }

    if (rejectData?.success) {
      enqueueSnackbar("Email sent to the user!", { variant: "success" });
      setOpen(false);
      navigate("/");
    }
  }, [rejectData, rejectError, enqueueSnackbar, navigate]);

  return (
    <Card
      elevation={1}
      sx={{ bgcolor: "transparent", p: 3, position: "relative" }}
    >
      <Dialog open={open} onClose={() => setOpen(false)}>
        <ConfirmDialog
          onClose={() => setOpen(false)}
          onConfirm={() => rejectRefetch()}
          message="Are you sure your want to reject this user? This user will be deleted from the database!"
          title="Reject Mentor"
          loading={rejectLoading}
        />
      </Dialog>
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
                onClick={() => approveRefetch()}
                disabled={approveLoading}
              >
                {approveLoading ? (
                  <TailSpin width="25px" height="25px" color="#000" />
                ) : (
                  "Approve✔"
                )}
              </Button>
            )}
            {mentorInfo && !approved && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => setOpen(true)}
              >
                Reject❌
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
