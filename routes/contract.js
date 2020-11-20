const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Contract = require("../models/contract");
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io/");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io/");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io/");
const privateKey = " "; // Put your private key here
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);


async function triggerSmartContract(contractAddress, requestFor) {
  let contract = await tronWeb.contract().at(contractAddress);
  if(requestFor === "getTokenName"){
    try {
      let result = await contract.name().call();
      return result;
    }catch(e) {
      console.error("get token name error:",e);
      return e.toString();
    }
  }
  else if(requestFor === "getTokenSymbol"){
    try {
      let result = await contract.symbol().call();
      return result;
    }catch(e) {
      console.error("get token symbol error:", e);
      return e.toString();
    }
  }
  else if(requestFor === "getTokenDecimals"){
    try {
      let result = await contract.decimals().call();
      return result;
    }catch(e) {
      console.error("get token decimals error:", e);
      return e.toString();
    }
  }
  else if(requestFor === "getTokenTotalSupply"){
    try {
      let result = await contract.totalSupply().call();
      let resultDecimal = BigInt(result._hex).toString();;
      return resultDecimal;
    }catch(e) {
      console.error("get token totalsupply error:", e);
      return e.toString();
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
    console.error("get token balance error:", e);
    return e.toString();
  }
}

async function getContractDetails(contractAddress){
  let details = {};
  let contract = await tronWeb.contract().at(contractAddress);
  try {
    details.name = await contract.name().call();
    details.symbol = await contract.symbol().call();
    details.decimal = await contract.decimals().call();
    return details;
  }catch(e) {
    console.error("get token contract details error:", e);
    return e.toString();
  }
}

async function makeTransfer(contractAddress, fromAddress, toAddress, amount, feeLimitAmount){
  var address = fromAddress;

  try {
      let contract = await tronWeb.contract().at(contractAddress);
      let txHash = "";
      await contract.transfer(
          toAddress, //address _to
          amount   //amount
      ).send({
          feeLimit: feeLimitAmount
      }).then(output => {
        txHash = output;
      });
      return txHash; 
  } catch(error) {
    return error;
  }
}

async function approveToken(contractAddress, spenderAddress, amount, feeLimitAmount){
  try {
      let contract = await tronWeb.contract().at(contractAddress);
      let txHash = "";
      await contract.approve(
          spenderAddress, //address _to
          amount   //amount
      ).send({
          feeLimit: feeLimitAmount
      }).then(output => {
        txHash = output;
      });
      return txHash; 
  } catch(error) {
    return error;
  }
}
/*  Method: To register token contract
    Developed By: Rudrika Fichadiya
    Date: 19/11/2020
*/
router.post("/addTokenContract", (req, res, next) => {
  if(req.body.contractAddress === undefined || req.body.contractAddress == " "){
    return res.status(200).json({message: "Please enter valid contractAddress"});
  }
  else {
    getContractDetails(req.body.contractAddress)
    .then(result => {
      const contractDetail = new Contract({
        _id: new mongoose.Types.ObjectId(),
        contractAddress: req.body.contractAddress,
        tokenName: result.name,
        tokenSymbol: result.symbol,
        decimals: result.decimal
      });
      contractDetail
      .save()
      .then(result => {
        res.status(200).json({
          contractAddress: req.body.contractAddress,
          message: "Token contract added successfully"
        });
      })
      .catch(err => {
          res.status(500).json({
            message: err.toString()
          });
        });
    })
    .catch(err => {
        return res.status(500).json({message: err.toString()});
    })
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

/*  Method: To transfer token to given address
    Developed By: Rudrika Fichadiya
    Date: 19/11/2020
*/
router.post("/transfer",  (req, res, next) => {

  if(req.body.toAddress === undefined || req.body.toAddress == " "){
    return res.status(200).json({message: "Please provide valid toAddress"});
  }
  else if(req.body.amount === undefined || req.body.amount == " "|| req.body.amount <= 0){
    return res.status(200).json({message: "Please provide valid amount"});
  }
  else if(req.body.token === undefined || req.body.token == " "){
    return res.status(200).json({message: "Please provide valid token"});
  }
  else if(req.body.fromAddress === undefined || req.body.fromAddress == " "){
    return res.status(200).json({message: "Please provide valid fromAddress"});
  }
  else if(req.body.feeLimit === undefined || req.body.feeLimit == " " || req.body.feeLimit <= 0){
    return res.status(200).json({message: "Please provide valid feeLimit"});
  }
  Contract.findOne({tokenSymbol: req.body.token})
    .then(tokenData => { 
      if(tokenData){
        getBalance(tokenData.contractAddress,req.body.fromAddress)
        .then(data => {
          if(req.body.amount >= data){
            return res.status(200).json({message: "Insufficient funds"});  
          }
          else{
            makeTransfer(tokenData.contractAddress, req.body.fromAddress, req.body.toAddress, req.body.amount, req.body.feeLimit)
            .then(transferData => {
              return res.status(200).json({txnHash: transferData, message: "Transfer done successfully"});
            })
            .catch(err => {
              return res.status(500).json({message: err.toString()});
            })
          }
        })
        .catch(err => {
          return res.status(500).json({message: err.toString()});
        })
      }
      else{
        return res.status(404).json({message: "Token not registered"});
      }   
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

/*  Method: To approve token to given address
    Developed By: Rudrika Fichadiya
    Date: 20/11/2020
*/
router.post("/approve",  (req, res, next) => {

  if(req.body.spenderAddress === undefined || req.body.spenderAddress == " "){
    return res.status(200).json({message: "Please provide valid spenderAddress"});
  }
  else if(req.body.amount === undefined || req.body.amount == " "|| req.body.amount <= 0){
    return res.status(200).json({message: "Please provide valid amount"});
  }
  else if(req.body.token === undefined || req.body.token == " "){
    return res.status(200).json({message: "Please provide valid token"});
  }
  else if(req.body.feeLimit === undefined || req.body.feeLimit == " " || req.body.feeLimit <= 0){
    return res.status(200).json({message: "Please provide valid feeLimit"});
  }
  Contract.findOne({tokenSymbol: req.body.token})
    .then(tokenData => { 
      if(tokenData){
        
        approveToken(tokenData.contractAddress, req.body.spenderAddress, req.body.amount, req.body.feeLimit)
        .then(approveData => {
          return res.status(200).json({txnHash: approveData, message: "Approve done successfully"});
        })
        .catch(err => {
          return res.status(500).json({message: err.toString()});
        })
      }
      else{
        return res.status(404).json({message: "Token not registered"});
      }   
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

module.exports = router;