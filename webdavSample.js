.then(async response =>{
    const client = await createClient(
      `https://store-yy9d3il1gg.mybigcommerce.com/dav`,
      {
          username: "admin@gobilda.com",
          password: process.env.SSP_WEBDAV_PASSWORD,
          digest:true
      }
  );

  
  await client.putFileContents("/content/sale-banner-script/saleBanner.js", `let saleBanners = ${JSON.stringify(response)}`)
    res.status(200).json('sucessfully generated paths')
  })
  .catch(err =>{
    console.log(err)
  })