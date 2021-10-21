let express = require("express");
let cacheMiddleware = require("../caching");
let router = express.Router();
const sqlite3 = require("sqlite3").verbose();

let myData = [];
function addData(value) {
  myData = value;
}
let allData = [];
function addInAllData(value) {
  allData = value;
}

router.get("/allData", cacheMiddleware(900), (req, res) => {
  const db = new sqlite3.Database("greenHouse.db");

  db.serialize(function () {
    db.all(
      "SELECT id,area AS location, year, value,cat_type AS gasType,category FROM gases",
      function (err, row) {
        if (err) {
          // console.log(err);
          res.status(400).send("Unable to access the DB or Run the query");
        } else {
          addInAllData(row);
          res.status(200).json(allData);
        }
      }
    );
    db.close();
  });
});

router.get("/countries", cacheMiddleware(900), (req, res) => {
  const db = new sqlite3.Database("greenHouse.db");

  db.serialize(function () {
    db.all(
      "SELECT id,area AS location,MIN(year) AS startYear, MAX(year) AS endYear, AVG(value) as value,cat_type AS gasType,category FROM gases GROUP BY area HAVING startYear > 1900",

      function (err, row) {
        if (err) {
          // console.log(err);
          res.status(400).send("Unable to access the DB or Run the query");
        } else {
          addData(row);
          res.status(200).json(myData);
        }
      }
    );
    db.close();
  });
});

router.get("/countries/id", cacheMiddleware(900), (req, res) => {
  var myquery = req.query;

  // console.log(myquery);

  if (Object.keys(myquery).length === 0 && myquery.constructor === Object) {
    res.status(400).send("Error: Query Parameter is missing.");
    return;
  }

  // verify the param keys and values
  for (let key in myquery) {
    if (!(key === "startYear" || key === "endYear" || key === "type")) {
      res
        .status(400)
        .send("Error: Invalid param key in Query Parameter-->" + key);
      return;
    }
    // check for duplicate keys, duplicate keys in params, make the value type as array, so checking for array
    if (Array.isArray(myquery[key])) {
      res
        .status(400)
        .send(
          "Error: Duplicate key/invalid value found in Query Parameter-->" + key
        );
      return;
    }
    // check for start/end Years
    if (key === "startYear" || key === "endYear") {
      if (!myquery.hasOwnProperty("startYear")) {
        res
          .status(400)
          .send(
            "Error: Missing key-value in Query Params for key--> startYear"
          );
        return;
      }
      if (!myquery.hasOwnProperty("endYear")) {
        res
          .status(400)
          .send("Error: Missing key-value in Query Params for key--> endYear");
        return;
      }

      let startValue = parseInt(myquery["startYear"]);
      let endValue = parseInt(myquery["endYear"]);
      if (
        startValue === NaN ||
        startValue === Infinity ||
        startValue < 1900 ||
        startValue > 2021
      ) {
        res
          .status(400)
          .send(
            "Error: Invalid value found in param key-->" +
              "startYear. " +
              "value range: 1901-2021"
          );
        return;
      }
      if (
        endValue === NaN ||
        endValue === Infinity ||
        endValue < 1900 ||
        endValue > 2021
      ) {
        res
          .status(400)
          .send(
            "Error: Invalid value in param key-->" +
              "endYear. " +
              "value range: 1901-2021"
          );
        return;
      }
      if (endValue < startValue) {
        res.status(400).send("Error: endYear is less than startYear");
        return;
      }
    }
    // check for type values
    if (key === "type") {
      // do something
      let gasTypes = myquery[key].split(",").filter((ele) => ele !== "");

      for (let gasValue of gasTypes) {
        if (
          !(
            gasValue === "ch4" ||
            gasValue === "co2" ||
            gasValue === "gas_ghgs" ||
            gasValue === "hfcs" ||
            gasValue === "hfcs_pfcs" ||
            gasValue === "n2o" ||
            gasValue === "nf3" ||
            gasValue === "pfcs" ||
            gasValue === "sf6"
          )
        ) {
          res
            .status(400)
            .send(
              `Error: Invalid value found in param key-->${key} , value-->${gasValue}. Valid values: (ch4,co2,gas_ghgs,hfcs,hfcs_pfcs,n2o,nf3,pfcs,sf6)`
            );
          return;
        }
      }
    }
  }
  // eg. starYear 2010 and end Year 2014 and type co2, nf3
  const db = new sqlite3.Database("greenHouse.db");

  // ************************** Query Building ************************
  let yearFilter = "";
  let and = "";
  let typeFilter = "";

  // query for year filter
  if (myquery.hasOwnProperty("startYear")) {
    let startValue = parseInt(myquery["startYear"]);
    let endValue = parseInt(myquery["endYear"]);

    yearFilter = ` (year>${startValue - 1} AND year<${endValue + 1}) `;

    if (startValue === endValue) yearFilter = ` (year=${startValue}) `;
  }
  // console.log(yearFilter);

  if (myquery.hasOwnProperty("startYear") && myquery.hasOwnProperty("type"))
    and = "AND";

  // query for type filter
  if (myquery.hasOwnProperty("type")) {
    let gasTypes = myquery["type"].split(",").filter((ele) => ele !== "");

    typeFilter = ` (gasType='${gasTypes[0]}'`;

    for (let i = 1; i < gasTypes.length; i++) {
      typeFilter += ` OR gasType='${gasTypes[i]}'`;
    }
    typeFilter += `)`;
  }
  // console.log(typeFilter);

  const finalQuery = `WHERE${yearFilter}${and}${typeFilter}`;
  // console.log(finalQuery);

  // const finalQuery = `WHERE (year>2010 AND year<2014) AND (gasType='co2' OR gasType='nf3')`;

  db.serialize(function () {
    db.all(
      "SELECT id,area AS location, year, value,cat_type AS gasType,category FROM gases " +
        finalQuery,

      function (err, row) {
        if (err) console.log(err);
        else {
          // addData(row);
          res.status(200).json(row);
        }
      }
    );
    db.close();
  });

  // res.send(myquery);
});

module.exports = router;
