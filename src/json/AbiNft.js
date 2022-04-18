module.exports = [{
	"inputs": [{
		"internalType": "contract IERC721",
		"name": "nftCode",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "minDuration",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "maxDuration",
		"type": "uint256"
	}],
	"stateMutability": "nonpayable",
	"type": "constructor"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "owner",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "price",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "timestamps",
		"type": "uint256"
	}],
	"name": "DoneOnShelf",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "from",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "price",
		"type": "uint256"
	}],
	"name": "DonePurchase",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": false,
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"indexed": false,
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "DoneWithdraw",
	"type": "event"
}, {
	"anonymous": false,
	"inputs": [{
		"indexed": true,
		"internalType": "address",
		"name": "previousOwner",
		"type": "address"
	}, {
		"indexed": true,
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "OwnershipTransferred",
	"type": "event"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	}],
	"name": "buy",
	"outputs": [],
	"stateMutability": "payable",
	"type": "function"
}, {
	"inputs": [],
	"name": "getMaxDuration",
	"outputs": [{
		"internalType": "uint256",
		"name": "duration",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "getMinDuration",
	"outputs": [{
		"internalType": "uint256",
		"name": "duration",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "getNftCode",
	"outputs": [{
		"internalType": "contract IERC721",
		"name": "nftCode",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	}],
	"name": "getOffShelfTime",
	"outputs": [{
		"internalType": "uint256",
		"name": "offShelfTime",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	}],
	"name": "getPrices",
	"outputs": [{
		"internalType": "uint256",
		"name": "price",
		"type": "uint256"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "owner",
	"outputs": [{
		"internalType": "address",
		"name": "",
		"type": "address"
	}],
	"stateMutability": "view",
	"type": "function"
}, {
	"inputs": [],
	"name": "renounceOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "tokenId",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "price",
		"type": "uint256"
	}, {
		"internalType": "uint256",
		"name": "offShelfTime",
		"type": "uint256"
	}],
	"name": "sell",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "duration",
		"type": "uint256"
	}],
	"name": "setMaxDuration",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "uint256",
		"name": "duration",
		"type": "uint256"
	}],
	"name": "setMinDuration",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "contract IERC721",
		"name": "nftCode",
		"type": "address"
	}],
	"name": "setNftCode",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "newOwner",
		"type": "address"
	}],
	"name": "transferOwnership",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}, {
	"inputs": [{
		"internalType": "address",
		"name": "to",
		"type": "address"
	}, {
		"internalType": "uint256",
		"name": "amount",
		"type": "uint256"
	}],
	"name": "withdraw",
	"outputs": [],
	"stateMutability": "nonpayable",
	"type": "function"
}]
