const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Contract = require("../models/contract");
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io/");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io/");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io/");
const privateKey = "";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
const trc20ContractAddress = "TRPCRk4o32zzSAiV8eFoaS9CwqshL6wiFR";//contract address


async function triggerSmartContract(contractAddress, requestFor) {
  
  let contract = await tronWeb.contract().at(contractAddress);
  if(requestFor === "getTokenName"){
    try {
      let result = await contract.name().call();
      return result;
    }catch(e) {
      console.error("trigger smart contract error:",e);
      return res.status(500).json({message: e.toString()});
    }
  }
  else if(requestFor === "getTokenSymbol"){
    try {
      let result = await contract.symbol().call();
      return result;
    }catch(e) {
      console.error("trigger smart contract error:", e);
      return res.status(500).json({message: e.toString()});
    }
  }
  else if(requestFor === "getTokenDecimals"){
    try {
      let result = await contract.decimals().call();
      return result;
    }catch(e) {
      console.error("trigger smart contract error:", e);
      return res.status(500).json({message: e.toString()});
    }
  }
  else if(requestFor === "getTokenTotalSupply"){
    try {
      let result = await contract.totalSupply().call();
      let resultDecimal = BigInt(result._hex).toString();;
      return resultDecimal;
    }catch(e) {
      console.error("trigger smart contract error:", e);
      return res.status(500).json({message: e.toString()});
    }
  }
}

async function getBalance(contractAddress, address){
  let contract = await tronWeb.contract().at(contractAddress);
  try {
    let result = await contract.balanceOf(address).call();
    let balance = BigInt(result).toString();
    return balance;
  }catch(e) {
    console.error("trigger smart contract error:", e);
    return res.status(500).json({message: e.toString()});
  }
}

// Contract address register
router.post("/addContract", (req, res, next) => {
  if(req.body.contractAddress === undefined || req.body.contractAddress == " "){
    return res.status(200).json({message: "Please enter valid contractAddress"});
  }
  else {
    
    const contract = new Contract({
      _id: new mongoose.Types.ObjectId(),
      contractAddress: req.body.contractAddress,
    });
    contract
    .save()
    .then(result => {
      res.status(200).json({
        contractAddress: req.body.contractAddress,
        message: "Contract registered successfully"
      });
    })
    .catch(err => {
        res.status(500).json({
          message: err.toString()
        });
      });
  }
});

/*  Method: To get token name of contract
    Developed By: Rudrika Fichadiya
    Date: 12/11/2020
*/
router.get("/getTokenName/:contractAddress",  (req, res, next) => {
  if(req.params.contractAddress === undefined || req.params.contractAddress == " "){
    return res.status(200).json({message: "Please provide contract address"});
  }
  Contract.findOne({contractAddress: req.params.contractAddress})
    .then(contractData => {
      triggerSmartContract(contractData.contractAddress,req.url.split('/')[1])
      .then(data =>{
        return res.status(200).json({tokenName: data});
      })
      .catch(err => {
        return res.status(500).json({message: err.toString()});
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

/*  Method: To get token symbol of contract
    Developed By: Rudrika Fichadiya
    Date: 12/11/2020
*/
router.get("/getTokenSymbol/:contractAddress",  (req, res, next) => {

  if(req.params.contractAddress === undefined || req.params.contractAddress == " "){
    return res.status(200).json({message: "Please provide contract address"});
  }
  Contract.findOne({contractAddress: req.params.contractAddress})
    .then(contractData => {
      triggerSmartContract(contractData.contractAddress,req.url.split('/')[1] )
      .then(data =>{
        return res.status(200).json({tokenSymbol: data});
      })
      .catch(err => {
        return res.status(500).json({message: err.toString()});
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

/*  Method: To get token decimals/precision of contract
    Developed By: Rudrika Fichadiya
    Date: 12/11/2020
*/
router.get("/getTokenDecimals/:contractAddress",  (req, res, next) => {

  if(req.params.contractAddress === undefined || req.params.contractAddress == " "){
    return res.status(200).json({message: "Please provide contract address"});
  }
  Contract.findOne({contractAddress: req.params.contractAddress})
    .then(contractData => {
      triggerSmartContract(contractData.contractAddress,req.url.split('/')[1])
      .then(data =>{
        return res.status(200).json({decimals: data});
      })
      .catch(err => {
        return res.status(500).json({message: err.toString()});
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

/*  Method: To get token totalSupply of contract
    Developed By: Rudrika Fichadiya
    Date: 13/11/2020
*/
router.get("/getTokenTotalSupply/:contractAddress",  (req, res, next) => {

  if(req.params.contractAddress === undefined || req.params.contractAddress == " "){
    return res.status(200).json({message: "Please provide contract address"});
  }
  Contract.findOne({contractAddress: req.params.contractAddress})
    .then(contractData => {
      triggerSmartContract(contractData.contractAddress,req.url.split('/')[1])
      .then(data =>{
        return res.status(200).json({totalSupply: data});
      })
      .catch(err => {
        return res.status(500).json({message: err.toString()});
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

/*  Method: To get balance of given address
    Developed By: Rudrika Fichadiya
    Date: 13/11/2020
*/
router.get("/getBalance/:contractAddress/:address",  (req, res, next) => {

  if(req.params.contractAddress === undefined || req.params.contractAddress == " "){
    return res.status(200).json({message: "Please provide contract address"});
  }
  else if(req.params.address === undefined || req.params.address == " "){
    return res.status(200).json({message: "Please provide valid address"});
  }
  Contract.findOne({contractAddress: req.params.contractAddress})
    .then(contractData => { 
      getBalance(contractData.contractAddress,req.params.address)
      .then(data => {
        return res.status(200).json({address: req.params.address, balance: data});
      })
      .catch(err => {
        return res.status(500).json({message: err.toString()});
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

module.exports = router;