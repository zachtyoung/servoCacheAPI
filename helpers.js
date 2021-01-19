const axios = require("axios");
const getPricingList = async (response, servos, storeID) => {
    let newBuffer = [];
    for (let i = 0; i < response.length; i++) {
      let el = response[i]
        const buffer = [];
        //el is one customer group with mutiple discount rules
        for (let i = 0; i < el.discount_rules.length; i++) {
          // el.servo_list = [...servos]
          if (el.discount_rules[i].type == "category") {
            let next = "";
            
            do {
              let response = await axios.get(
                `https://api.bigcommerce.com/stores/${storeID}/v3/catalog/products?categories:in=${el.discount_rules[i].category_id}&include_fields=categories,name,price&limit=250${next}`,
                {
                  headers: {
                    "X-Auth-Client": `${process.env.SSP_CLIENT_P}`,
                    "X-Auth-Token": `${process.env.SSP_TOKEN_P}`,
                  },
                }
              );
              await response.data.data.map(async el2 =>{
                if(el2.categories.includes(435)){
                  let percent = parseInt(el.discount_rules[i].amount)/100
                  let finalPrice = el2.price - (percent * el2.price)
                  el2.price = Math.ceil(finalPrice * 100) / 100;

                  el.servo_list.forEach((elmt, index) => {
                    if(elmt.id == el2.id){
                      if(el2.price <elmt.price){
                      el.servo_list[index]=el2
                      }
                    }
                  })

                  
            
                }
              })
      
              next = response.data.meta.pagination.links.next;
            } while (next);
       
          }
        }
        newBuffer.push(el);
    }
    return newBuffer;
  };
exports.getPricingList = getPricingList;