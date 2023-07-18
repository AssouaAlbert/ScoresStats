/*DEPENDENCIES IMPORT*/
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cron = require("node-cron");

/* SCRIPTS */
const checkDailayDb = require("./scripts/checkDailayDb");
const mail = require("./scripts/sendEmail");
const router = require("./routes/index");
/* ERROR */
const filename = "example.txt";

/**CONFIGURATIONS */
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
    /* --------------------------- Subscribe To Store --------------------------- */
const { unsubscribe } = require("./store/store");

/* MONGOOSE SETUP */
const PORT = process.env.PORT || 9000;
/* CONNNECT TO DATABASE */
app.use("/", router);
/* CONNNECT TO DATABASE */
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(async () => {
    /* START SERVER*/
    app.listen(PORT, () => console.log("Server is running on port %d", PORT));
    await checkDailayDb();
    cron.schedule("00 00 * * *", async () => {
      await checkDailayDb();
    });
  })
  .catch((error) => {
    unsubscribe();
    message = { subject: "file: index.js:49", message: error.message };
    mail(message);
  });
