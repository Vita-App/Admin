import React from "react";
import axios from "axios";
import { SERVER_URL } from "config.keys";
import { Stack, IconButton } from "@mui/material";
import { Group, Mail, Add, VideoCall, Logout } from "@mui/icons-material";
import ToolbarLink from "./ToolbarLink";
import { useSetRecoilState } from "recoil";
import { authState } from "store";
import { useNavigate } from "react-router";

const Toolbar = () => {
  const navigate = useNavigate();
  const setAuthState = useSetRecoilState(authState);

  const logout = async () => {
    await axios.get(`${SERVER_URL}/api/admin/logout`);

    setAuthState({ isLoggedIn: false, user: null });
    navigate("/");
  };

  return (
    <Stack spacing={1}>
      <ToolbarLink icon={<Group />} tooltip="Users" to="/" />
      <ToolbarLink icon={<VideoCall />} tooltip="Meetings" to="/meetings" />
      <ToolbarLink icon={<Mail />} tooltip="Emails" to="/emails" />
      <ToolbarLink icon={<Logout />} tooltip="Logout" onClick={logout} />
      <IconButton
        onClick={() => {}}
        sx={{
          backgroundColor: "#ef4848",
          color: "white",
          "&:hover": {
            bgcolor: "#e03030",
            color: "white",
          },
        }}
      >
        <Add />
      </IconButton>
    </Stack>
  );
};

export default Toolbar;
