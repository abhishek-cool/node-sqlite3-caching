let express = require("express");
const initializeDb = require("../initSqlDB/createDB");
let router = express.Router();

router.get("/initializeDB", (req, res) => {
  initializeDb(res);
  // res.send("done");
});

module.exports = router;
