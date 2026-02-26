import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // check login status

  const handleLogout = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    await axios.post("http://localhost:5000/api/auth/logout", {
      userId: user.id,
    });

  } catch (err) {
    console.log("Logout log failed:", err);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  navigate("/l");
};

  return (
    <AppBar position="static" sx={{ background: "#1e1e2f", paddingY: 1 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        {!token ? (
          <>
            <Box>
              <Button
                component={Link}
                to="/s"
                variant="contained"
                color="secondary"
                sx={{ textTransform: "none" }}
              >
                Register
              </Button>
            </Box>
            <Box>
              <Button
                component={Link}
                to="/l"
                variant="contained"
                color="secondary"
                sx={{ textTransform: "none" }}
              >
                Login
              </Button>
            </Box>
          </>
        ) : (
          <Box>
            <Button
              onClick={handleLogout}
              variant="contained"
              color="secondary"
              sx={{ textTransform: "none" }}
            >
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

