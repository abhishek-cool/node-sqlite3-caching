const express = require("express");
const swaggerUi = require("swagger-ui-express");
const openApiDocumentation = require("./openApiDocumentation");
const app = express();

app.use(express.json());

var myLogger = (req, res, next) => {
  //   console.log(req);
  console.log(`path: ${req.url} --> method: ${req.method}`);
  next();
};

app.use(myLogger);

let initDBRoute = require("./routes/initializeDB");
let greenHouseRoutes = require("./routes/greenHouseRoutes");

app.use(initDBRoute);
app.use(greenHouseRoutes);

// app.use("/", (req, res, next) => {
//   res.status(200).send("List of APIs");
// });

app.use("/", swaggerUi.serve, swaggerUi.setup(openApiDocumentation));

const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) console.log(err);

  console.log(`Server has started on ${PORT}`);
});
