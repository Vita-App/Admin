import React from "react";
import { Box } from "@mui/material";

interface Props {
  children: any;
  centered?: boolean;
}

const Container: React.FC<Props> = ({ children, centered = false }) => {
  if (centered) {
    return (
      <Box
        flexGrow={1}
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
      >
        {children}
      </Box>
    );
  }

  return (
    <Box pr={2} pl={10} pt={3}>
      {children}
    </Box>
  );
};

export default Container;
