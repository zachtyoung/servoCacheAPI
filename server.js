const express = require("express");
const axios = require("axios");
const cors = require("cors");
const helpers = require("./helpers");
const server = express();
const { createClient } = require("webdav");
server.use(cors());
const {
  performance,
  PerformanceObserver
} = require('perf_hooks');
const e = require("express");
server.use(express.json());
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
  let storeID = "tnsp6i3ma6"
  let servoCatID = '422'
  let customer_groups;
  let servos;
  axios
    .get(`${base}${storeID}/v2/customer_groups`, {
      headers: {
        "X-Auth-Client": `${process.env.SSP_CLIENT_P}`,
        "X-Auth-Token": `${process.env.SSP_TOKEN_P}`,
      },
    })
    .then((response) => {
      customer_groups = response.data;
      axios
    .get(
      `${base}${storeID}/v3/catalog/products?categories:in=${servoCatID}&limit=250&page=1&include=custom_fields,images&include_fields=name,price,sku,availability`,
      {
        headers: {
          "X-Auth-Client": `${process.env.SSP_CLIENT_P}`,
          "X-Auth-Token": `${process.env.SSP_TOKEN_P}`,
        },
      }
    )
    .then(async (response) => {
      servos = await response.data.data;
     await servos.forEach(servo =>{
        servo.images.forEach(image =>{
          if(image.is_thumbnail = true){
            servo.images = image 
          }
        })
      })
      let temp = await customer_groups.map(el =>{
        el.servo_list = [...servos]
      })
      return customer_groups
    })
    .then((response) => {
      return helpers.getPricingList(response, servos, storeID);
    })
    .then(async (response) => {
      const client = await createClient(
        `https://store-yy9d3il1gg.mybigcommerce.com/dav`,
        {
            username: "admin@gobilda.com",
            password: process.env.SSP_WEBDAV_PASSWORD,
            digest:true,
            
        }
    );

    response.forEach(async group =>{


   if (await client.exists(`/content/servos_page/servos_list_by_customer${group.id}.js`) === false) {
      await client.putFileContents(`/content/servos_page/servos_list_by_customer${group.id}.js`, `let servo_list = ${JSON.stringify(group.servo_list)}`);
  }else{
          await client.putFileContents(`/content/servos_page/servos_list_by_customer${group.id}.js`, `let servo_list = ${JSON.stringify(group.servo_list)}`);
  }
    })
    res.status(200).json(response[7])
 console.log('Done')
  })
    })

  
    .catch(err =>{
      console.log(err)
    })
});
module.exports = server;
