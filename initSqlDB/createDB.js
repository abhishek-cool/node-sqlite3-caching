let csv = require("fast-csv");
let fs = require("fs");

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("greenHouse.db");
const filePath = "./data_cleaned.csv";

function initializeDb(res) {
  const stream = fs.createReadStream(filePath);
  db.serialize(function () {
    db.run("DROP TABLE IF EXISTS gases");
    // country_or_area	year	value	cat_types	category
    db.run(
      "CREATE TABLE IF NOT EXISTS gases (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, area TEXT, year INT, value INT, cat_type TEXT, category TEXT)"
    );
    let stmt = db.prepare(
      "INSERT INTO gases (area,year,value,cat_type,category) VALUES (?,?,?,?,?)"
    );
    csv
      .parseStream(stream, { headers: true })
      .on("data", function (data) {
        try {
          //   res.write(`<p>${JSON.stringify(data)}</p>`);
          let placeHolder1 = data.country_or_area;
          let placeHolder2 = parseInt(data.year);
          let placeHolder3 = parseInt(data.value);
          let placeHolder4 = data.cat_types;
          let placeHolder5 = data.category;
          stmt.run(
            placeHolder1,
            placeHolder2,
            placeHolder3,
            placeHolder4,
            placeHolder5
          );
        } catch (err) {
          console.log(err);
        }
      })
      .on("end", function () {
        console.log("done with csv");
        //   res.send("completed creating DB");
        stmt.finalize();
        db.each(
          "SELECT id,area,year,value,cat_type,category FROM gases",
          function (err, row) {
            //   area,year,value,cat_type,category
            //   console.log(
            //     "User id : " + row.id,
            //     row.area,
            //     row.year,
            //     row.value,
            //     row.cat_type,
            //     row.category
            //   );
            res.write(`<p>${JSON.stringify(row)}</p>`);
          }
        );
        db.close();
        // fs.close();
        // res.end("done");
      });
  });
}

module.exports = initializeDb;
