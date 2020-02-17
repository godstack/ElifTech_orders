const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};

const app = express();

app.use(cors(corsOptions));

app.use(express.static(path.join(__dirname, "client", "build")));

app.use("/", require("./routes/order.routes"));

const PORT = config.get("port") || 9000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    });

    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });

    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}...`);
    });
  } catch (e) {
    console.log(`Server Error`, e.message);
    process.exit(1);
  }
}

start();
