const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helpers = require("./helpers");
const server = express();
server.use(cors());
server.use(express.json());
const {
  performance,
  PerformanceObserver
} = require('perf_hooks');
server.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  next();
});

server.get("/", (req, res) => {
  let base = "https://api.bigcommerce.com/stores/";
  let comb = [];
  let customer_groups;
  let servos;
  axios
    .get(`${base}yy9d3il1gg/v2/customer_groups`, {
      headers: {
        "X-Auth-Client": `${process.env.SSP_CLIENT}`,
        "X-Auth-Token": `${process.env.SSP_TOKEN}`,
      },
    })
    .then((response) => {
      customer_groups = response.data;
    });

  axios
    .get(
      `${base}yy9d3il1gg/v3/catalog/products?categories:in=435&limit=250&page=1&include=custom_fields,images&include_fields=name,price,sku,availability`,
      {
        headers: {
          "X-Auth-Client": `${process.env.SSP_CLIENT}`,
          "X-Auth-Token": `${process.env.SSP_TOKEN}`,
        },
      }
    )
    .then((response) => {
      servos = response.data;
      return customer_groups;
    })
    .then((response) => {
      return helpers.getPricingList(response);
    })
    // .then((response) => {
    //   response.map(el =>{
    //     el.discount_rules.map(el2 =>{
    //       el2.servo_list.map(el3 =>{
    //         console.log(el3.id)
    //       })
    //     })
    //   })
     
    // })
    .then((response) => {
      res.status(200).json(response);
    })
});
module.exports = server;
