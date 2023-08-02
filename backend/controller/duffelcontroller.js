import catchasyncerror from "../middleware/catchasyncerror.js";
import Errorhandler from "../utils/errorhandler.js"
import dotenv from "dotenv"
if(process.env.NODE_ENV!=="PRODUCTION"){
    dotenv.config({path:"backend/config.env"})
};
import axios from "axios"

export const getaccesstokencontroller=catchasyncerror(async(req,res,next)=>{
  const url = 'https://api-gateway.sandbox.standardbank.co.mw/identity/auth/access-token';
  const authorizationHeader = process.env.NETWORK_API_KEY;

  if(!authorizationHeader){
    return next(new Errorhandler("apikey missing error, try again, please",400))
  }

fetch(url, {
  method: 'POST',
  headers: {
    'Authorization': authorizationHeader
  }
})
  .then(response => response.json())
  .then(data => {
    let accesstoken=data.access_token;
    res.status(201).json({
      accesstoken
    })
  })
  .catch(error => {
    // console.error('Error:', error);
    return next(new Errorhandler("token error",400))

  });
  
})

export const createordercontroller=catchasyncerror(async(req,res,next)=>{
  const {accesstoken,price,email,billingFName,billingLName}=req.body;
  if(!accesstoken){
    return next(new Errorhandler("token missing error",400))
  };

  if(!price ||!email ||!billingFName ||!billingLName){
    return next(new Errorhandler("Please enter all field",400))
  }
  
  
  const searchParams={  
    "action": "PURCHASE",   
    "amount" : { "currencyCode" : "MWK", "value" : price },
    "emailAddress":email,
    "merchantAttributes": {
      "redirectUrl": "https://itinertrip.com/success/redirect",
      "skipConfirmationPage": true,
      "skip3DS": false,
      "cancelUrl": "https://itinertrip.com/cancel/basket",
      "cancelText": "Continue Shopping"
    },
    // "merchantOrderReference": "myorder-00001",
    "billingAddress": {
      "firstName": billingFName,
      "lastName": billingLName
    }
  }
  if(!searchParams){
    return next(new Errorhandler("please add all required fields",400))
  }
  const orderdata = await axios.post("https://api-gateway.sandbox.standardbank.co.mw/transactions/outlets/e6f5ce4c-ae8e-4a51-81c4-cd3bb3c5c82f/orders", searchParams, {
      headers: {
        "Content-Type": "application/vnd.ni-payment.v2+json",
        "Authorization": `Bearer ${accesstoken}`
      },
    });
    let orderlink=orderdata.data;
    let link=orderlink._links.payment.href;
    
    res.status(201).json({
      success:true,
      link,
      orderlink
    })

});


export const searchflightcontroller=catchasyncerror(async(req,res,next)=>{
  const searchParams=req.body;
  
  if(!searchParams){
    return next(new Errorhandler("Please add all search querries", 400))
  }

  let duffelkey=process.env.DUFFEL_API_KEY;
  if(!duffelkey){
    return next(new Errorhandler("api key missing, try again please", 400))
  }
  const searchdata = await axios.post("https://api.duffel.com/air/offer_requests", searchParams, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // 'Accept-Encoding':'gzip',
        "Duffel-Version": "v1",
        Authorization: duffelkey,
      },
    });
    let searchFlight=searchdata.data.data;
    // console.log(searchFlight)
    res.status(201).json({
      success:true,
      searchFlight
    })

});


export const bookflightcontroller=catchasyncerror(async(req,res,next)=>{
  const searchParams=req.body;
  
  if(!searchParams){
    return next(new Errorhandler("Please add all search querries", 400))
  };
  let duffelkey=process.env.DUFFEL_API_KEY;
  if(!duffelkey){
    return next(new Errorhandler("api key missing, try again please", 400))
  }
  const response = await axios.post(`https://api.duffel.com/air/orders`, searchParams, {
    headers: {
      "Content-Type": "application/json",
          Accept: "application/json",
          // 'Accept-Encoding':'gzip',
          "Duffel-Version": "v1",
          Authorization: duffelkey,
    },
  });
  let createOrder = response.data;
    // console.log(searchFlight)
    res.status(201).json({
      success:true,
      createOrder
    })

});

export const getlocationcontroller=catchasyncerror(async(req,res,next)=>{
  let querycity=req.body.query;

  let duffelkey=process.env.DUFFEL_API_KEY;
  if(!duffelkey){
    return next(new Errorhandler("api key missing, try again please", 400))
  }
  
  const response=await axios.get(`https://api.duffel.com/places/suggestions?query=${querycity}`,{
    headers:{
      Accept:"application/json",
      "Duffel-Version": "v1",
      Authorization: duffelkey,

    }
  });
  let city=response.data.data;
  res.status(200).json({
    success:true,
    city

  })
})



export const getwebhookscontroller=catchasyncerror(async(req,res,next)=>{
  const webhooks=req.body
  
  res.status(200).json({
    success:true,
    webhooks
  })
})


