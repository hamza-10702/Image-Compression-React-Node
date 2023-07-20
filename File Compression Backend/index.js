const express = require("express");
const imageRoute = require("./route/imageProcess.routes");
const connectDb = require("./config/connectDb");
const cors = require("cors");
const app = express();

app.use(cors());

const PORT = 5001;
connectDb(`mongodb://localhost:27017`);

app.use("/api", imageRoute);

app.listen(PORT, () => {
  console.log("Server is listening on port 3000");
});
