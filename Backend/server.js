import express from "express";
import connectDB from './config/db.js';
import cors from "cors";
import employeeRoutes from "./Routes/EmployeesRoute.js";
import dotenv from "dotenv";


const app = express();
const PORT = 3000;
dotenv.config();

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