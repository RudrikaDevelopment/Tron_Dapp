const http = require('http');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port);

console.log("Listening on port:"+ port);
/*const TronGrid = require("trongrid");
const TronWeb = require("tronweb");

const tronWeb = new TronWeb({
    fullHost: "https://api.trongrid.io"
});

const tronGrid = new TronGrid(tronWeb);

const address = "TDDJXpFuKvHUPLYFfmrHd12yUoakTZwb7g";
// #1 Function - 1
async function getTransactions(addr){
    const options = {
        onlyTo: true
    }
    const transactions = await tronGrid.account.getTransactions(address, options);
    console.log(transactions);   
}
//getTransactions(address);

// #2 Function - 2
async function createAccount(){
    // const options = {
    //     onlyTo: true
    // }
    const generatedAccount = await tronGrid.utils.accounts.generateAccount();
    //console.log(generatedAccount);   
}
//createAccount();

// #3 Function - 3
var txId = "b8a2381f39685beed53e8784171f8815f2155025934e8349d2d3215bce5e95d9";
async function getEventByTxId(txId){
    // const options = {
    //     onlyTo: true
    // }
    
    try{
        //await tronWeb.getEventByTransactionID(txId);
        // await tronGrid.events.getEventByTransactionID("78938dc73353a9a2cc45f7e20e4f9344f99e31bfcd5d54337a0bd9f2c8626604")
        // .then(result => {
        //     //console.log(result.length)
        // })
        console.log(tronGrid.account);   
    }
    catch(e){
        console.log("Exception: "+e.toString());
    }
}
getEventByTxId(txId);*/
//console.log(HttpProvider+"HttpProvider");