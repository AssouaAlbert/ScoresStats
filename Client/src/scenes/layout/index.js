import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
// import { useGetUserQuery } from "state/api";

function Layout() {
    const isNonMobile = useMediaQuery("(min-width: 600px)")
  return (
    <div>
      <Box display={isNonMobile? "flex": "block"}width="100%" height="100%">
        <Box flexGrow={1}>
          <Navbar isSidebarOpen={isNonMobile}/>
          <Outlet />
        </Box>
      </Box>
    </div>
  );
}

export default Layout;
