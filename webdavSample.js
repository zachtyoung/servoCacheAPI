.then(async response =>{
    const client = await createClient(
      `https://store-${
        id == "gobilda_staging"? process.env.GOBILDA_STAGING_STORE :
        id =="gobilda_production"?process.env.GOBILDA_STORE:
        id =="servocity_staging"?process.env.SERVOCITY_STAGING_STORE:
        id == "servocity_production"?process.env.SERVOCITY_STORE:''
      }.mybigcommerce.com/dav`,
      {
          username: "admin@gobilda.com",
          password: id == "gobilda_staging"? process.env.GOBILDA_STAGING_STORE_WEBDAV_PASSWORD :
          id =="gobilda_production"?process.env.GOBILDA_STORE_WEBDAV_PASSWORD:
          id =="servocity_staging"?process.env.SERVOCITY_STAGING_STORE_WEBDAV_PASSWORD:
          id == "servocity_production"?process.env.SERVOCITY_STORE_WEBDAV_PASSWORD:'',
          digest:true
      }
  );

  
  await client.putFileContents("/content/sale-banner-script/saleBanner.js", `let saleBanners = ${JSON.stringify(response)}`)
    res.status(200).json('sucessfully generated paths')
  })
  .catch(err =>{
    console.log(err)
  })