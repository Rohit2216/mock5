const express = require("express");
const { connection } = require("./config/db");
const { userRouter } = require("./routes/userRoutes");
const {employeeRouter}=require("./routes/employeRouter")
const {auth}=require("./middleware/auth")
const cors = require("cors");
const app = express();
require("dotenv").config();

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send({ msg: "Welcome to HomePage." });
});

app.use("/", userRouter);

app.use("/", employeeRouter);



app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Database is connected successfully!");
  } catch (error) {
    console.log(error.message);
    console.log("Database connection failed. Please check the database configuration.");
  }

  console.log(`Server is running on port ${process.env.port}`);
});
