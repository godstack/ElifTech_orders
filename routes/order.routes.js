const { Router } = require("express");
const StringFormatValidation = require("string-format-validation");
const Order = require("../models/Order");
const router = Router();

const { IncomingForm } = require("formidable");

const csv = require("csv-parser");
const fs = require("fs");

let MyData = [];

let MyValidatedData = [];

const validationRules = {
  user_email: {
    type: "email"
  }
};

async function addToDatabase(MyValidatedData) {
  try {
    for (let i = 0; i < MyValidatedData.length; i++) {
      const candidate = await Order.findOne(MyValidatedData[i]);

      if (candidate) {
        console.log(`Such record already exist ${i}`);
        continue;
      }

      let valEntries = Object.entries(MyValidatedData[i]);

      console.log("candidate");
      for (const [header, value] of valEntries) {
        console.log(`header ${header} and value ${value}`);
      }

      const order = new Order({
        [valEntries[0][0]]: valEntries[0][1],
        [valEntries[1][0]]: valEntries[1][1],
        [valEntries[2][0]]: valEntries[2][1],
        [valEntries[3][0]]: valEntries[3][1]
      });

      await order.save();
    }
  } catch (e) {
    console.log("error is " + e.message);
  }
}

// /upload

router.post("/upload", async (req, res) => {
  try {
    const form = IncomingForm();

    form.on("file", (field, file) => {
      fs.createReadStream(file.path)
        .pipe(csv())
        .on("data", row => {
          let headerLineArr = [];
          let dataArr = [];
          let rowEntries = Object.entries(row);
          headerLineArr = rowEntries[0][0].split(";");
          dataArr = rowEntries[0][1].split(";");

          MyData.push({
            ["user_email"]: dataArr[0],
            [headerLineArr[1]]: dataArr[1],
            [headerLineArr[2]]: dataArr[2],
            [headerLineArr[3]]: dataArr[3],
            [headerLineArr[4]]: dataArr[4]
          });
        })
        .on("end", () => {
          for (let i = 0; i < MyData.length; i++) {
            let entries = Object.entries(MyData[i]);
            let j = 0;
            console.log(`obj number ${i + 1}`);
            for (const [header, value] of entries) {
              if (j == 0) {
                let emailOk = StringFormatValidation.validate(
                  validationRules.user_email,
                  value
                );

                if (!emailOk) {
                  console.log("email trouble ");
                  break;
                }
              } else if (j == 1) {
                let now = new Date();
                let date = new Date(value);
                if (date == "Invalid Date" || date > now) {
                  console.log("date trouble ");
                  break;
                }
              } else if (j == 2) {
                let number = Number(value);

                if (isNaN(number) || number < 0) {
                  console.log("value trouble ");
                  break;
                }
              } else if (j == 3) {
                if (value != "USD") {
                  console.log("currency trouble");
                  break;
                }
              } else if (j == 4) {
                console.log("status" + value);
                if (value != "approved") {
                  console.log("status trouble");
                  break;
                }

                MyValidatedData.push({
                  [entries[0][0]]: entries[0][1],
                  [entries[1][0]]: entries[1][1],
                  [entries[2][0]]: entries[2][1],
                  [entries[3][0]]: entries[3][1]
                });
              }
              j++;
            }
          }

          console.log("valid data length: " + MyValidatedData.length);

          addToDatabase(MyValidatedData);
          console.log("Csv file successfully processed");
        });
    });

    form.on("end", () => {
      res.json();
    });

    form.parse(req);
  } catch (e) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

// /api

router.get("/api", async (req, res) => {
  try {
    const pageNo = parseInt(req.query.pageNo);
    const size = parseInt(req.query.size);
    let query = {};
    if (pageNo <= 0) {
      response = {
        error: true,
        message: "invalid page number, should start with 1"
      };
      return res.json(response);
    }

    query.skip = size * (pageNo - 1);
    query.limit = size;

    //Find data

    const dbData = await Order.find({}, {}, query);

    const totalCount = await Order.countDocuments({});

    let totalPages = Math.ceil(totalCount / size);

    const response = { message: dbData, pages: totalPages };

    res.send(JSON.stringify(response));
  } catch (e) {
    console.log(`Unable to retrieve data from database, error: ${e.message}`);
  }
});

module.exports = router;
