import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import clsx from 'clsx';
import { useGetFullGamesListQuery } from "state/api";
import Header from "components/Header";

const columns = [
  {
    field: "game",
    headerName: "Game",
    flex: 1,
    renderCell: (params) => {
      return `${params.row?.home?.title} vs ${params.row?.away?.title}`;
    },
  },
  {
    field: "league",
    headerName: "Event",
    flex: 1,
    renderCell: (params) => {
      console.log("🚀 ~ file: index.js:25 ~ params:", params)
      return `${params.row?.country}/${params.row?.stage}`;
    },
  },
  {
    field: "gpg",
    headerName: "Average Goals/Game",
    flex: 0.4,
    renderCell: (params) => {
      const h2h = params.row?.h2h;
      let scores = 0;
      h2h.forEach((game) => {
        scores += game["home"]["homeScore"] + game["away"]["awayScore"];
      });
      return `${"" + Number.parseFloat(scores / h2h.length).toFixed(2)}`;
    },
  },
  {
    field: "positionDiff",
    headerName: "Position Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.positionDiff >= 4,
      cold: params.row?.comparison?.positionDiff <= -4,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.positionDiff
          ? params.row?.comparison?.positionDiff
          : 0
      }`;
    },
  },
  {
    field: "playedDiff",
    headerName: "Games Played Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.playedDiff > 0,
      cold: params.row?.comparison?.playedDiff < 0,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.playedDiff
          ? params.row?.comparison?.playedDiff
          : 0
      }`;
    },
  },
  {
    field: "winsDiff",
    headerName: "Wins Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.winsDiff < -4,
      cold: params.row?.comparison?.winsDiff > 4,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.winsDiff ? params.row?.comparison?.winsDiff : 0
      }`;
    },
  },
  {
    field: "drawsDiff",
    headerName: "Draws Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.drawsDiff > 0,
      cold: params.row?.comparison?.drawsDiff < 0,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.drawsDiff
          ? `${params.row?.comparison?.drawsDiff}`
          : 0
      }`;
    },
  },
  {
    field: "lossesDiff",
    headerName: "Losses Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.lossesDiff > 0,
      cold: params.row?.comparison?.lossesDiff < 0,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.lossesDiff
          ? params.row?.comparison?.lossesDiff
          : 0
      }`;
    },
  },
  {
    field: "goalsForDiff",
    headerName: "Goals For Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.goalsForDiff < 0,
      cold: params.row?.comparison?.goalsForDiff > 10,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.goalsForDiff
          ? params.row?.comparison?.goalsForDiff
          : 0
      }`;
    },
  },
  {
    field: "goalsAgainstDiff",
    headerName: "Goals Against Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.goalsAgainstDiff > 0,
      cold: params.row?.comparison?.goalsAgainstDiff < -10,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.goalsAgainstDiff
          ? params.row?.comparison?.goalsAgainstDiff
          : 0
      }`;
    },
  },
  {
    field: "goalsDiffDiff",
    headerName: "Goals Diff",
    type: "number",
    flex: 0.4,
    renderCell: (params) => {
      return `${
        params.row?.comparison?.goalsDiffDiff
          ? params.row?.comparison?.goalsDiffDiff
          : 0
      }`;
    },
  },
  {
    field: "pointsDiff",
    headerName: "Points Diff",
    type: "number",
    flex: 0.4,
    cellClassName: (params) =>
    clsx('super-app', {
      hot: params.row?.comparison?.pointsDiff < -12,
      cold: params.row?.comparison?.pointsDiff > 12,
    }),
    renderCell: (params) => {
      return `${
        params.row?.comparison?.pointsDiff
          ? params.row?.comparison?.pointsDiff
          : 0
      }`;
    },
  },
];

function Dashboard() {
  const theme = useTheme();
  const { data, isLoading } = useGetFullGamesListQuery();
  return (
    <Box>
      <Header title={"All Games"} subtitle={"List of All Games"} />
      <Box
        mt="40px"
        height="75vh"
        p={"2rem"}
        width={"100%"}
        sx={{
          "& .cold": {
            background: "#4f987f",
          },
          "& .hot": {
            background: "#a65b5b",
          },
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: theme.palette.primary.light,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.alt,
            color: theme.palette.secondary[100],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
          autoPageSize
        />
      </Box>
    </Box>
  );
}

export default Dashboard;
