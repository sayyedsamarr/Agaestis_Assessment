require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const employeeRoutes = require("./Routes/EmployeesRoute");
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(cors());


app.use("/employees", employeeRoutes);

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();