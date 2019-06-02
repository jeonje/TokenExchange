let express = require('express');
let app = express();
let Web3 = require('web3');
let Tx = require('ethereumjs-tx');

if (typeof Web3 !== 'undefined') {
   web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/829a14a4e6a5475797232b2333cface6')); // connect ropsten network
  console.log('Web3 -> ropsten.infura.io Provider');
} else {
      web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io')); // ropsten 네트워크로 연결
  }

  //smart contract abi (remix)
let abi = [
	{
		"constant": false,
		"inputs": [
			{
				"name": "_spender",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalSupply",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_from",
				"type": "address"
			},
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "change_owner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_token",
				"type": "address"
			}
		],
		"name": "Check_balanceForToken",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_spender",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "decreaseApprove",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawEther",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_spender",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "increaseApprove",
		"outputs": [
			{
				"name": "success",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_token",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "deposit",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "Check_Ether",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to_user_addr",
				"type": "address"
			},
			{
				"name": "_from_amount",
				"type": "uint256"
			},
			{
				"name": "_to_amount",
				"type": "uint256"
			},
			{
				"name": "_from_token_addr",
				"type": "address"
			},
			{
				"name": "_to_token_addr",
				"type": "address"
			},
			{
				"name": "_token_Index",
				"type": "uint256"
			},
			{
				"name": "_token_rate",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getRate",
		"outputs": [
			{
				"name": "",
				"type": "uint256[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "isOwner",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_token",
				"type": "address"
			},
			{
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "withdrawToken",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to",
				"type": "address"
			},
			{
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "transfer",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_to_user_addr",
				"type": "address"
			},
			{
				"name": "_from_amount",
				"type": "uint256"
			},
			{
				"name": "_to_amount",
				"type": "uint256"
			},
			{
				"name": "_from_token_addr",
				"type": "address"
			},
			{
				"name": "_to_token_addr",
				"type": "address"
			},
			{
				"name": "_token_Index",
				"type": "uint256"
			},
			{
				"name": "_token_rate",
				"type": "uint256"
			}
		],
		"name": "exchange",
		"outputs": [],
		"payable": true,
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_rate",
				"type": "uint256[]"
			}
		],
		"name": "setRate",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "_owner",
				"type": "address"
			},
			{
				"name": "_spender",
				"type": "address"
			}
		],
		"name": "allowance",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "transferOwnership",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "token_rate",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"payable": true,
		"stateMutability": "payable",
		"type": "fallback"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_from_user_addr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_to_user_addr",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_from_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_to_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_from_token",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_to_token",
				"type": "address"
			}
		],
		"name": "ResultForExchangeAndTransfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_rate",
				"type": "uint256[]"
			}
		],
		"name": "ResultForsetRate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_accountAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_token",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_balance",
				"type": "uint256"
			}
		],
		"name": "ResultForDeposit",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_toAddress",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_token",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"name": "_balance",
				"type": "uint256"
			}
		],
		"name": "ResultForWithdrawToken",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_amount",
				"type": "uint256"
			}
		],
		"name": "ResultForWithdrawEther",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "ResultForChangeOwner",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_from",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_to",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_owner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_spender",
				"type": "address"
			},
			{
				"indexed": false,
				"name": "_value",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"name": "_previousOwner",
				"type": "address"
			},
			{
				"indexed": true,
				"name": "_newOwner",
				"type": "address"
			}
		],
		"name": "OwnershipTransferred",
		"type": "event"
	}
];
const adminAddress = '0xd17a1bcc63cec3bb0459fda1f43171e6be66055a';
const tokenExchangeAddress = '0x57f60e009357264a3e63b1dd71010cf98a465543'
const pkey ='D68EA99D2D26BB7A15357459589776DFF773D73B6468D7FE13168821A61B19A9'; //private key

const smartContract = new web3.eth.Contract(abi, tokenExchangeAddress); // remix TokenExchange ABI and deplayed address
app.listen(3001, function() {
  console.log('Listening port 3001!');
}); //end of Listening

let EOS_to_BNB = 5.31545157 // ex ) 1 EOS token =  5.31545157  BNB token
let EOS_to_VEN = 5.6058
let BNB_to_VEN = 2.8049
let BNB_to_EOS = 1 / EOS_to_BNB
let VEN_to_EOS = 1 / EOS_to_VEN
let VEN_to_BNB = 1 / BNB_to_VEN

let contract_EOS_to_BNB = 0;
let contract_EOS_to_VEN = 0;
let contract_BNB_to_VEN = 0;
let contract_BNB_to_EOS = 0;
let contract_VEN_to_EOS = 0;
let contract_VEN_to_BNB = 0;
let arr = [0, 0, 0, 0, 0, 0];
let showDecimal = 10 ** 8;

setInterval(() => {
  EOS_to_BNB = addRandomRate(EOS_to_BNB); // generate random rate
  EOS_to_VEN = addRandomRate(EOS_to_VEN);
  BNB_to_VEN = addRandomRate(BNB_to_VEN);
  BNB_to_EOS = (1 / EOS_to_BNB);
  VEN_to_EOS = (1 / EOS_to_VEN);
  VEN_to_BNB = (1 / BNB_to_VEN);
  rate = [EOS_to_BNB, EOS_to_VEN, BNB_to_EOS, BNB_to_VEN, VEN_to_EOS, VEN_to_BNB];

  console.log("    현재환율    ");
  console.log(rate);  //show current token rate

  contract_EOS_to_BNB = Math.floor((EOS_to_BNB * showDecimal));
  contract_EOS_to_VEN = Math.floor((EOS_to_VEN * showDecimal));
  contract_BNB_to_EOS = Math.floor((BNB_to_EOS * showDecimal));
  contract_BNB_to_VEN = Math.floor((BNB_to_VEN * showDecimal));
  contract_VEN_to_EOS = Math.floor((VEN_to_EOS * showDecimal));
  contract_VEN_to_BNB = Math.floor((VEN_to_BNB * showDecimal));

  arr = [contract_EOS_to_BNB, contract_EOS_to_VEN, contract_BNB_to_EOS, contract_BNB_to_VEN, contract_VEN_to_EOS, contract_VEN_to_BNB];

  console.log("    스마트 컨트랙트로 저장되는 환율   (환율* 10**8)  ");
  console.log(arr);

  const contractFunction = smartContract.methods.setRate(arr);  //set token rate to smart contract
  const functionAbi = contractFunction.encodeABI(); //send sigendtransaction to ropsten testnet
  let estimatedGas;
  let nonce;
  console.log("Getting gas estimate");
  contractFunction.estimateGas({from: adminAddress}).then((gasAmount) => {  
    estimatedGas = gasAmount.toString(16);
    console.log("Estimated gas: " + estimatedGas);
    web3.eth.getTransactionCount(adminAddress).then(_nonce => {
      nonce = _nonce.toString(16);
      console.log("Nonce: " + nonce);
      const txParams = {
        gasPrice: web3.utils.toHex('250000000000'),
        gas : web3.utils.toHex('210000'),
        gasLimit: web3.utils.toHex('3000000'),
        to: tokenExchangeAddress,
        data: functionAbi,
        from: adminAddress,
        nonce: '0x' + nonce,
        chainId: web3.utils.toHex('3')
      };
      const tx = new Tx(txParams);
      const privatekey = Buffer.from(pkey,'hex');
      tx.sign(privatekey);
      const serializedTx = tx.serialize();
      web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', receipt => {

      })
    });
  });


  smartContract.methods.getRate().call({  //get the token rate from smart contract every 180 second
    from: adminAddress
  }, (error, result) => {
    if (error) {
      console.error();
    } else {
      console.log("  이전에 저장되었던 환율 ");
      for (let i = 0; i < result.length; i++) {
        process.stdout.write(result[i] + " ");
      }
      console.log("\n");
    }
  });
}, 180000);

function addRandomRate(token) {
  up_down = Math.floor(Math.random() * 2);
  amount_of_change = Math.random() / 10;
  if (up_down == 0) { //rate down
    token = token - amount_of_change;
    if (token <= 0) {
      token = Math.floor(Math.random() * 5) + Math.random();
    }
  } else { // rate up
    token = token + amount_of_change;
  }
  return token;
}

process.addListener("SIGINT", function() {
  console.log("\nStop Token Rate Generator");
  process.exit(0);
});
