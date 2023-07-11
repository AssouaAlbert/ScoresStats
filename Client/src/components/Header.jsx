import { Typography, Box, useTheme } from "@mui/material";

function Header({ title, subtitle }) {
  const theme = useTheme();

  return (
    <Box padding="0 20px">
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px" }}
      >
        {title.toUpperCase()}
      </Typography>
      <Typography
        variant="h5"
        color={theme.palette.secondary[100]}
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

export default Header;
