module.exports = {
  openapi: "3.0.1",
  info: {
    version: "0.2",
    title: "Assignment-1 (nodeJS with sqlite3 and caching)",
    description: "List of APIs ",
    contact: {
      name: "Abhishek Kumar",
      email: "abhishek.k.official29@gmail.com",
      url: "http://mern.in/",
    },
  },
  servers: [
    {
      url: "http://localhost:5000/",
      description: "Local server",
    },
    {
      url: "https://node-sqlite3-deploy.herokuapp.com/",
      description: "Production server",
    },
  ],
  security: [
    {
      ApiKeyAuth: [],
    },
  ],
  tags: [
    {
      name: "Initialize SQLite3 DB",
    },
    {
      name: "Countries APIs",
    },
  ],
  paths: {
    "/initializeDB": {
      get: {
        tags: ["Initialize SQLite3 DB"],
        description:
          "Creates a SQLite3 DB, add gases table and write the table with data_cleaned.csv(https://www.kaggle.com/unitednations/international-greenhouse-gas-emissions) file",
        operationId: "initSQliteDB",

        responses: {
          200: {
            description: "Creates GreenHouse.db using SQLite3 package",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      example: "GreenHouse DB created using SQLite3 package",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Failed to create the DB",
            content: {
              "text/html": {
                schema: {
                  type: "string",
                  examples: {
                    message: "Unable to access the DB or Run the query",
                  },
                },
              },
            },
          },
        },
      },
    },
    "/countries": {
      get: {
        tags: ["Countries APIs"],
        description:
          "Get all countries in the dataset (names, ids and their possible values for startYear and endYear)",
        operationId: "getCountriesWithStartEndValues",

        responses: {
          200: {
            description:
              "Obtained countries in the dataset (names, ids and their possible values for startYear and endYear)",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    location: {
                      type: "string",
                      example: "Australia",
                    },
                    startYear: {
                      type: "integer",
                      example: 2010,
                    },
                    endYear: {
                      type: "integer",
                      example: 2014,
                    },
                    value: {
                      type: "integer",
                      example: "393126",
                    },
                    gasType: {
                      type: "string",
                      example: "co2",
                    },
                    category: {
                      type: "string",
                      example:
                        "carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Failed to retrieve countries",
            content: {
              "text/html": {
                schema: {
                  type: "string",
                  message: "Unable to access the DB or Run the query",
                },
              },
            },
          },
        },
      },
    },
    "/countries/id": {
      get: {
        tags: ["Countries APIs"],
        description:
          "Get countries with filter condition on startYear, endYear, gasType",
        operationId: "getFilteredCountries",
        parameters: [
          {
            name: "startYear",
            in: "query",
            schema: {
              type: "integer",
              default: 2010,
            },
            required: false,
          },
          {
            name: "endYear",
            in: "query",
            schema: {
              type: "integer",
              default: 2014,
            },
            required: false,
          },
          {
            name: "type",
            in: "query",
            schema: {
              type: "string",
              // enum: [
              //   "ch4",
              //   "co2",
              //   "gas_ghgs",
              //   "hfcs",
              //   "hfcs_pfcs",
              //   "n2o",
              //   "nf3",
              //   "pfcs",
              //   "sf6",
              // ],
              default: "co2",
              example: "ch4,co2,gas_ghgs,hfcs,hfcs_pfcs,n2o,nf3,pfcs,sf6",
            },
            required: false,
          },
        ],
        responses: {
          200: {
            description: "Filtered countries were obtained",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    location: {
                      type: "string",
                      example: "Australia",
                    },
                    year: {
                      type: "integer",
                      example: 2010,
                    },
                    value: {
                      type: "integer",
                      example: "393126",
                    },
                    gasType: {
                      type: "string",
                      example: "co2",
                    },
                    category: {
                      type: "string",
                      example:
                        "carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Missing/Invalid parameters",
            content: {
              "text/html": {
                schema: {
                  type: "string",
                  message: "Invalid key-values in the query parameters",
                },
              },
            },
          },
        },
      },
    },
    "/allData": {
      get: {
        tags: ["Countries APIs"],
        description: "Get All data present in gases table from greenHouse.db",
        operationId: "getAllData",

        responses: {
          200: {
            description:
              "Obtained all data present in the table gases in greenHouse.db sqLite3 database",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "integer",
                      example: 1,
                    },
                    location: {
                      type: "string",
                      example: "Australia",
                    },
                    year: {
                      type: "integer",
                      example: 2010,
                    },
                    value: {
                      type: "integer",
                      example: "393126",
                    },
                    gasType: {
                      type: "string",
                      example: "co2",
                    },
                    category: {
                      type: "string",
                      example:
                        "carbon_dioxide_co2_emissions_without_land_use_land_use_change_and_forestry_lulucf_in_kilotonne_co2_equivalent",
                    },
                  },
                },
              },
            },
          },
          400: {
            description: "Failed to retrieve data from DB",
            content: {
              "text/html": {
                schema: {
                  type: "string",
                  message: "Unable to access the DB or Run the query",
                },
              },
            },
          },
        },
      },
    },
  },
};
