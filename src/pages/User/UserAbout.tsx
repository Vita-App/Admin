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
} from "@mui/material";

import {
  Check,
  MoreHoriz,
  Edit,
  Delete,
  ForwardToInbox,
} from "@mui/icons-material";

const UserAbout = () => {
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
        <Box flex="1 0 400px" height="400px" borderRadius={5}>
          <img
            src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131"
            alt="user"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: 10,
            }}
          />
        </Box>
        <Stack>
          <Typography variant="h4">Prof. Daniel</Typography>
          <Typography variant="body1" color="textSecondary">
            Software Engineer
          </Typography>
          <Stack direction="row" my={1}>
            <Chip
              icon={<Check />}
              label="Mentor"
              color="success"
              variant="outlined"
            />
          </Stack>
          <Stack direction="row" spacing={1} my={1}>
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
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis
            neque, culpa alias facere, esse in quo iusto repellendus illum
            facilis perspiciatis officia ratione autem nostrum corrupti
            consectetur odit optio quidem, qui unde beatae necessitatibus
            deserunt odio nisi. Ea officiis commodi praesentium possimus
            consequatur error molestiae, ipsum quasi sed aperiam asperiores
            iusto laboriosam, ullam veritatis deleniti voluptate. Quibusdam
            provident, perspiciatis voluptatem earum eveniet officia nemo, eius
            ullam delectus ducimus sint velit repellendus perferendis sequi aut
            at culpa, eos unde cumque nihil tempore similique. Ducimus,
            dignissimos sapiente. Cum non ut neque voluptatem provident debitis
            odio eveniet soluta iste accusamus delectus, quasi, ab magnam omnis
            excepturi, cupiditate optio blanditiis quos cumque modi itaque.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi animi
            tempora accusantium iste quisquam. Est enim cum laborum. Ab
            voluptatibus officia veritatis eius beatae necessitatibus fuga
            magnam consequuntur aut?
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};

export default UserAbout;
