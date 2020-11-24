import React, { useState, useEffect } from "react";
import logo from "./tronlogo.svg";
import "./App.css";

function App(){

  const [trnSection, setTrnSection] = useState({})
  const [balanceSection, setBalSection] = useState({})
  const [allowanceSection, setAllowanceSection] = useState({})
  const [approveSection, setApproveSection] = useState({})
  const [value, setValue] = useState("")
  const [resData, setResData] = useState()
  const [resDataTrn, setResDataTrn] = useState({})
  const [resDataTrnFrm, setResDataTrnFrm] = useState({})
  const [resDataBal, setResDataBal] = useState({})
  const [resDataAllowance, setResDataAllowance] = useState({})
  const [resDataApprove, setResDataApprove] = useState({})
  

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const handleTransferInput = (e) => {
    setTrnSection({
      ...trnSection,
      [e.target.name] : e.target.value
    })
  }

  const handleBalanceInput = (e) => {
    setBalSection({
      ...balanceSection,
      [e.target.name] : e.target.value
    })
  }

  const handleAllowanceInput = (e) => {
    setAllowanceSection({
      ...allowanceSection,
      [e.target.name] : e.target.value
    })
  }
  
  const handleApproveInput = (e) => {
    setApproveSection({
      ...approveSection,
      [e.target.name] : e.target.value
    })
  }

  function submitDataSymbol(){
    console.log("Value :",value)
    fetch(`http://localhost:3001/contract/getTokenSymbol/${value}`)
    .then(results => results.json())
    .then(data =>setResData(data.tokenSymbol))
  }
  function submitDataName(){
    console.log("Value :",value)
    fetch(`http://localhost:3001/contract/getTokenName/${value}`)
    .then(results => results.json())
    .then(data =>setResData(data.tokenName))
  }
  function submitDataTotalSupply(){
    console.log("Value :",value)
    fetch(`http://localhost:3001/contract/getTokenTotalSupply/${value}`)
    .then(results => results.json())
    .then(data =>setResData(data.totalSupply))
  }
  function submitDataDecimals(){
    console.log("Value :",value)
    fetch(`http://localhost:3001/contract/getTokenDecimals/${value}`)
    .then(results => results.json())
    .then(data =>setResData(data.decimals))
  }

  function submitGetBalance(){
    fetch(`http://localhost:3001/contract/getBalance/${balanceSection.contract}/${balanceSection.address}`)
    .then(results => results.json())
    .then(data =>{ setResDataBal(data)})
  }
  
  function submitTransfer(){
    fetch(`http://localhost:3001/contract/transfer`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trnSection)
      })
    .then(results => results.json())
    .then(data =>{ setResDataTrn(data)})
  }

  function submitTransferFrom(){
    fetch(`http://localhost:3001/contract/transferFrom`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(trnSection)
      })
    .then(results => results.json())
    .then(data =>{ setResDataTrnFrm(data)})
  }

  function submitAllowance(){
    fetch(`http://localhost:3001/contract/allowance`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(allowanceSection)
      })
    .then(results => results.json())
    .then(data =>{ setResDataAllowance(data)})
  }

  function submitApprove(){
    fetch(`http://localhost:3001/contract/approve`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(approveSection)
      })
    .then(results => results.json())
    .then(data =>{ setResDataApprove(data)})
  }

  return (
    <div className= "App">
      <h1>Tron D-App </h1>
      <header>
        <img src={logo} height ="200" width="200"/>
      </header><br/>
      
      <div className= "form-group">
        <label><b>Token Contract Address</b><br/><br/>
        
        <input value={value} name="value" onChange={handleInput} className= "textarea" type="text" name="contractAddress1"/> <br/><br/>
        <button type= "button" name="" onClick={submitDataSymbol} className="sendButton" > Symbol </button>
        <button type= "button" onClick={submitDataName} className="sendButton" > Name </button>
        <button type= "button" onClick={submitDataTotalSupply} className="sendButton" > Total Supply </button>
        <button type= "button" onClick={submitDataDecimals} className="sendButton" > Decimals </button><br/><br/>
        </label>
        <h3>{resData}</h3>

        <hr className= ".line"></hr>
        <label><b>Token Contract Address:</b>&nbsp;&nbsp;
        <input value={balanceSection.contract} name="contract" onChange={handleBalanceInput} className= "textarea" type="text"/>&nbsp;&nbsp;&nbsp;
        <label><b>Address</b>&nbsp;&nbsp;
        <input value={balanceSection.address} name="address" onChange={handleBalanceInput} className= "textarea" type="text"/> <br/><br/>
        </label>
        <button type= "button" onClick={submitGetBalance} className="sendButton" > Get Balance </button><br/><br/>
        </label>
        <h3>{resDataBal.balance}</h3>

        <hr className= ".line"></hr>
        <label><b>Token :</b> &nbsp;</label>
        <input value={trnSection.token} name="token" onChange={handleTransferInput} className= "textarea" type="text"/>&nbsp;&nbsp;&nbsp;<br/><br/>
        <label><b>From Address:</b> &nbsp;
        <input value={trnSection.fromAddress} onChange={handleTransferInput} className= "textarea" type="text" name="fromAddress"/>&nbsp;&nbsp;&nbsp;
        </label>
        <label><b>To Address:</b>&nbsp;
        <input value={trnSection.toAddress} onChange={handleTransferInput} className= "textarea" type="text" name="toAddress"/> <br/><br/>
        </label>
        <label><b> Amount: </b> </label>
        <input value={trnSection.amount} onChange={handleTransferInput} className= "textarea" type="text" name="amount"/> &nbsp;&nbsp;&nbsp;
        <label><b> FeeLimit: </b> </label>
        <input value={trnSection.feeLimit} onChange={handleTransferInput} className= "textarea" type="text" name="feeLimit"/> <br/><br/>
        <button type= "button" onClick={submitTransfer} className="sendButton" > Transfer </button> &nbsp;&nbsp;&nbsp;
        <button type= "button" onClick={submitTransferFrom} className="sendButton" > TransferFrom</button><br/><br/>
        <h3>Message: {resDataTrn.message} {resDataTrnFrm.message}</h3>
        <h3>TxnHash: {resDataTrn.txnHash} {resDataTrnFrm.txnHash}</h3>
        

        <hr className= ".line"></hr>
        <label><b>Token :</b> &nbsp;</label>
        <input value={allowanceSection.token} name="token" onChange={handleAllowanceInput} className= "textarea" type="text"/>&nbsp;&nbsp;&nbsp;<br/><br/>
        <label><b>Spender Address: </b>&nbsp;&nbsp;
        <input value={allowanceSection.spenderAddress} name="spenderAddress" onChange={handleAllowanceInput} className= "textarea" type="text"/>&nbsp;&nbsp;&nbsp;
        <label><b>Owner Address: </b>&nbsp;&nbsp;
        <input value={allowanceSection.ownerAddress} name="ownerAddress" onChange={handleAllowanceInput} className= "textarea" type="text"/> <br/><br/>
        </label>
        <button type= "button" onClick={submitAllowance} className="sendButton" > Get Allowance </button><br/><br/>
        </label>
        <h3>{resDataAllowance.allowanceAmount}</h3>

        <hr className= ".line"></hr>
        <label><b>Token :</b> &nbsp;</label>
        <input value={approveSection.token} name="token" onChange={handleApproveInput} className= "textarea" type="text"/>&nbsp;&nbsp;&nbsp;<br/><br/>
        <label><b>Spender Address: </b>&nbsp;&nbsp;
        <input value={approveSection.spenderAddress} name="spenderAddress" onChange={handleApproveInput} className= "textarea" type="text"/>&nbsp;&nbsp;&nbsp;
        <label><b>Amount: </b>&nbsp;&nbsp;
        <input value={approveSection.amount} name="amount" onChange={handleApproveInput} className= "textarea" type="text"/> <br/><br/>
        </label>
        <label><b>feeLimit: </b>&nbsp;&nbsp;
        <input value={approveSection.feeLimit} name="feeLimit" onChange={handleApproveInput} className= "textarea" type="text"/> <br/><br/>
        </label>
        <button type= "button" onClick={submitApprove} className="sendButton" > Approve </button><br/><br/>
        </label>
        <h3>{resDataApprove.message}</h3>
        <h3>{resDataApprove.txnHash}</h3>
      </div>
    </div>
  );
}

export default App;