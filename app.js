const express = require("express");
const config = require("config");
const mongoose = require("mongoose");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
};

const app = express();

app.use(cors(corsOptions));

app.use("/", require("./routes/order.routes"));

const PORT = config.get("port") || 5000;

async function start() {
  try {
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
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
