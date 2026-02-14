const express = require("express");
const cors = require("cors");
const routes = require("./routes/trainerRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/trainer", routes);

app.listen(5000, () => console.log("Server running on port 5000"));