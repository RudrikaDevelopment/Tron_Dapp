const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Contract = require("../models/contract");
const TronWeb = require('tronweb')
const HttpProvider = TronWeb.providers.HttpProvider;
const fullNode = new HttpProvider("https://api.shasta.trongrid.io/");
const solidityNode = new HttpProvider("https://api.shasta.trongrid.io/");
const eventServer = new HttpProvider("https://api.shasta.trongrid.io/");
const privateKey = "0aca16784a26552a317bdf9dd6dd566142634b4054ae78b65c29108565ab7d0e";
const tronWeb = new TronWeb(fullNode,solidityNode,eventServer,privateKey);
const trc20ContractAddress = "TRPCRk4o32zzSAiV8eFoaS9CwqshL6wiFR";//contract address


async function triggerSmartContract(contractAddress) {
  //const trc20ContractAddress = "TRPCRk4o32zzSAiV8eFoaS9CwqshL6wiFR";//contract address

  try {
        let contract = await tronWeb.contract().at(contractAddress);
        let result = await contract.name().call();
        return result;
    } catch(e) {
        console.error("trigger smart contract error:",e);
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

// Contract getName
router.get("/getTokenName/:contractAddress",  (req, res, next) => {

  if(req.params.contractAddress === undefined || req.params.contractAddress == " "){
    return res.status(200).json({message: "Please provide contract address"});
  }
  Contract.findOne({contractAddress: req.params.contractAddress})
    .then(contractData => {
      triggerSmartContract(contractData.contractAddress)
      .then(data =>{
        return res.status(200).json({tokenName: data});
      })
      .catch(err => {
        return res.status(500).json({message: e.toString()});
      })
    })
    .catch(err => {
      res.status(500).json({
        message: err.toString()
    });
  });
});

module.exports = router;