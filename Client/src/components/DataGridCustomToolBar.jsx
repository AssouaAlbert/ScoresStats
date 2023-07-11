import React from "react";
import { Search } from "@mui/icons-material";
import { IconButton, TextField, InputAdornment, Icon } from "@mui/material";
import {
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarColumnsButton,
} from "@mui/x-data-grid";
import FlexBetween from "./FlexBetween";

function DataGridCustomToolBar({ searchInput, setSearchInput, setSearch }) {
  return (
    <GridToolbarContainer>
      {/* <FlexBetween width="100%">
        <FlexBetween>
          <GridToolbarDensitySelector />
          <GridToolbarColumnsButton />
          <GridToolbarExport />
        </FlexBetween>
        <TextField
          label="Search..."
          sx={{
            mb: "0.5rem",
            width: "15rem",
          }}
          onChange={(e) => setSearchInput(e.target.value)}
          value={searchInput}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => {
                    setSearch(searchInput);
                    setSearchInput("");
                }}></IconButton> <Search />
              </InputAdornment>
            ),
          }}
        />
      </FlexBetween> */}
    </GridToolbarContainer>
  );
}

export default DataGridCustomToolBar;
