const express = require('express');
const axios = require('axios')
const cors = require("cors");
const { response } = require('express');
const { restart } = require('nodemon');
const server = express();
server.use(cors());
server.use(express.json());
server.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
    next();
  });

  const getCategoryDescription = async (el) =>{
    for(let i=0; i<el.discount_rules.length; i++){
        if(el.discount_rules[i].type == 'category'){
            const buffer = []
            let next = ""
    do {
      let response = await axios.get(`https://api.bigcommerce.com/stores/yy9d3il1gg/v3/catalog/products?categories:in=${el.discount_rules[i].category_id}&include_fields=categories,name,price&limit=250${next}`, {
        headers:{
            'X-Auth-Client':'3zoh474unyimj3sb4p1c8akvc92rvhn',
            'X-Auth-Token':'5cyod5itlb3i2zm5ivskpyjrlnmlh8r'
          }})
          buffer.push(...response.data.data)
        next = response.data.meta.pagination.links.next
    } while (next);
 
    return buffer
      }
      } 
  }
server.get('/', (req, res) => {
    let comb = []
    let customer_groups 
    let servos
    axios.get(`https://api.bigcommerce.com/stores/yy9d3il1gg/v2/customer_groups`, {
        headers:{
          'X-Auth-Client':'3zoh474unyimj3sb4p1c8akvc92rvhn',
          'X-Auth-Token':'5cyod5itlb3i2zm5ivskpyjrlnmlh8r'
        }
      })
      .then(response =>{
 
          customer_groups = response.data
      })

    axios.get(`https://api.bigcommerce.com/stores/yy9d3il1gg/v3/catalog/products?categories:in=435&limit=250&page=1&include=custom_fields,images&include_fields=name,price,sku,availability`, {
          headers:{
            'X-Auth-Client':'3zoh474unyimj3sb4p1c8akvc92rvhn',
            'X-Auth-Token':'5cyod5itlb3i2zm5ivskpyjrlnmlh8r'
          }
        })
        .then(response =>{
           
            servos = response.data
            return customer_groups
        })
        .then(response =>{
        const myFunc = async () =>{
                     let newBuffer = []
                     for(let i=0; i<response.length; i++){
                      let ans = await getCategoryDescription(response[i])
                     newBuffer.push({"id":response[i].id, 'cats':ans})
                     } 
                    return newBuffer
            }
           return myFunc()
          
       
     

        })
        .then(response =>{
            res.status(200).json(response)
        })

        
});
module.exports = server;
