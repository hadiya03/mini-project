import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // check login status

  const handleLogout = async () => {
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        if (user && user.id) {
          await fetch("http://localhost:5000/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id })
          });
        }
      }
    } catch (err) {
      console.error("Logout error", err);
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/l"); // redirect to login
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
              color="blue"
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

