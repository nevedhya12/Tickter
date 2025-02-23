import React, {useState, useEffect} from 'react';
import {ethers} from 'ethers';

const Tickter = () => {
    const [provider, setProvider] = useState(null);
    const [signer, setSigner] = useState(null);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const [tokenID, setTokenID] = useState(null);
    const [ownedTickets, setOwnedTickets] = useState(0);
    const [ticketsOnReSale, setTicketsOnReSale] = useState(0);
    const [ticketsOnSale, setTicketsOnSale] = useState(0);
    const [refresh, setRefresh] = useState(0)



    const [providerAddress, setProviderAddress] = useState("");
    const contractAddress = "0x2c19013d5d3ddddd711b25929f3070f97a08cc36";

    const contractABI =[
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721IncorrectOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721InsufficientApproval",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "approver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidApprover",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOperator",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidOwner",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "receiver",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidReceiver",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "sender",
                    "type": "address"
                }
            ],
            "name": "ERC721InvalidSender",
            "type": "error"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ERC721NonexistentToken",
            "type": "error"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "approved",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
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
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "indexed": false,
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "ApprovalForAll",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "indexed": true,
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "Transfer",
            "type": "event"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "approve",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "balanceOfOwner",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "burn",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenID",
                    "type": "uint256"
                }
            ],
            "name": "buyReSaleTicket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenID",
                    "type": "uint256"
                }
            ],
            "name": "cancelReSaleOfTicket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "generateTicket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "getApproved",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                }
            ],
            "name": "isApprovedForAll",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "name",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "ownerOf",
            "outputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenID",
                    "type": "uint256"
                },
                {
                    "internalType": "uint256",
                    "name": "price",
                    "type": "uint256"
                }
            ],
            "name": "resellTicket",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                },
                {
                    "internalType": "bytes",
                    "name": "data",
                    "type": "bytes"
                }
            ],
            "name": "safeTransferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "operator",
                    "type": "address"
                },
                {
                    "internalType": "bool",
                    "name": "approved",
                    "type": "bool"
                }
            ],
            "name": "setApprovalForAll",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes4",
                    "name": "interfaceId",
                    "type": "bytes4"
                }
            ],
            "name": "supportsInterface",
            "outputs": [
                {
                    "internalType": "bool",
                    "name": "",
                    "type": "bool"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "symbol",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "tokenURI",
            "outputs": [
                {
                    "internalType": "string",
                    "name": "",
                    "type": "string"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "from",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "to",
                    "type": "address"
                },
                {
                    "internalType": "uint256",
                    "name": "tokenId",
                    "type": "uint256"
                }
            ],
            "name": "transferFrom",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]

    useEffect(() => {
        const connectWallet = async () => {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                await provider.send('eth_requestAccounts', []);
                const signer = provider.getSigner();
                setProvider(provider);
                setSigner(signer);

                const accountAddress = await signer.getAddress();
                setAccount(accountAddress);

                console.log(accountAddress);

                const contract = new ethers.Contract(contractAddress, contractABI, signer);
                setContract(contract);
                balanceOfOwnerButton();
                setRefresh(refresh+1)
            } catch (error) {
                console.error("Error connecting to wallet: ", error);
            }

        };
        connectWallet();

    }, []);


//1st
  
//2nd
     
//4th
 
//3rd

    const generateTicketButton = async () => {
        try {
            
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            setProvider(provider);
            setSigner(signer);
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(contract);
            console.log("ticket generating...")
            await contract.generateTicket();
            console.log("ticket Generated");
            balanceOfOwnerButton();
            

        } catch(error) {
            console.error("Error fetching patient records", error);
        }
    }

    const viewOwnerOfTicketButton = async () => {
        try {
            const ownerOfTicket = await contract.viewOwnerOfTicket(tokenID);
            alert(`Owner of ${tokenID} is ${ownerOfTicket}`);

        } catch(error) {
            console.error("Error adding records", error);
        }

    }

    const balanceOfOwnerButton = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            setProvider(provider);
            setSigner(signer);
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(contract);
            console.log("hello")
            var ownedTickets = await contract.balanceOfOwner();

            setOwnedTickets(ownedTickets.toNumber())
        } catch(error) {
            console.error(error)
        }
    }
    
    const ResellTicketButton = async () => {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send('eth_requestAccounts', []);
            const signer = provider.getSigner();
            setProvider(provider);
            setSigner(signer);
            const contract = new ethers.Contract(contractAddress, contractABI, signer);
            setContract(contract);
            const price = 1;
            await contract.resellTicket(4, price);
            console.log('69');
            console.log(ticketsOnReSale);
            setTicketsOnReSale(ticketsOnReSale+1);
        } catch(error) {
            console.error("Error on sale", error);
        }
    }

    const CancelResellButton = async () => {
        try {
            await contract.cancelReSaleOfTicket(tokenID);
            console.log("ticket removed from sale");
        } catch(error) {
            console.error(error);
        }
    }

    const BuyTicketsOnReSaleButton = async () => {
        try {
            await contract.buyReSaleTicket(tokenID);
            setTicketsOnSale(ticketsOnSale+1)
            console.log("bought from resale");

        } catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const container = document.getElementById("buy-from-resell");
        if (!container) {
            console.error("Element not found");
            return;
        }
    
        container.innerHTML = ""; // Clear previous content
    
        for (let i = 0; i < ticketsOnSale; i++) { // Example: 3 divs
            const div = document.createElement("div");
            const buyButton = document.createElement("button");
            const infoButton = document.createElement("button");
            const whiteSpace = document.createElement("div")
            const buttonCollection = document.createElement("div")
            buttonCollection.className = "bought-window-buttons"
            whiteSpace.className = "white-space";
            buyButton.className = "sell";
            buyButton.innerText = "Sell";
            infoButton.className = "info";
            infoButton.innerText = "Info";
            buttonCollection.appendChild(buyButton)
            buttonCollection.appendChild(infoButton)
    
            div.className = "window";
            div.appendChild(whiteSpace);
            div.appendChild(buttonCollection);
            container.appendChild(div);
        }
    }, []);  

    useEffect(() => {
        const container = document.getElementById("buying-window-section");
        if (!container) {
            console.error("Element not found");
            return;
        }
    
        container.innerHTML = ""; // Clear previous content
    
        for (let i = 0; i < 1; i++) { // Example: 3 divs
            const div = document.createElement("div");
            const buyButton = document.createElement("button");
            const whiteSpace = document.createElement("div")
            whiteSpace.className = "white-space";
            buyButton.className = "buy";
            buyButton.innerText = "Buy";
            buyButton.addEventListener('click', generateTicketButton)
            div.className = "window";
            div.appendChild(whiteSpace);
            div.appendChild(buyButton);
            container.appendChild(div);
        }
    }, []);  

    useEffect(() => {
        const container = document.getElementById("cancel-resell");
        if (!container) {
            console.error("Element not found");
            return;
        }
    
        container.innerHTML = ""; // Clear previous content
    
        for (let i = 0; i < ticketsOnSale; i++) { // Example: 3 divs
            const div = document.createElement("div");
            const cancelButton = document.createElement("button");
            const whiteSpace = document.createElement("div")
            whiteSpace.className = "white-space";
            cancelButton.className = "buy";
            cancelButton.innerText = "Buy";
    
            div.className = "window";
            div.appendChild(whiteSpace);
            div.appendChild(cancelButton);
            container.appendChild(div);
        }
    }, [refresh]);  

    useEffect(() => {
        const container = document.getElementById("owned-window-section");
        if (!container) {
            console.error("Element not found");
            return;
        }
    
        container.innerHTML = ""; // Clear previous content
    
        for (let i = 0; i < ownedTickets; i++) { // Example: 3 divs
            const div = document.createElement("div");
            const sellButton = document.createElement("button");
            const infoButton = document.createElement("button");
            const whiteSpace = document.createElement("div")
            const buttonCollection = document.createElement("div")
            buttonCollection.className = "bought-window-buttons"
            whiteSpace.className = "white-space";
            sellButton.className = "sell";
            sellButton.innerText = "Sell";
            infoButton.className = "info";
            infoButton.innerText = "Info";
            sellButton.addEventListener('click', ResellTicketButton)
            buttonCollection.appendChild(sellButton)
            buttonCollection.appendChild(infoButton)
    
            div.className = "window";
            div.appendChild(whiteSpace);
            div.appendChild(buttonCollection);
            container.appendChild(div);
        }
    }, [refresh]);  

    return(
        <div className='container'>
            <div className='upper-box'>
                <div className='logo'><h1>LOGO</h1></div>
                <div className='options'>
                    <p className='options-child'>Re-Sell Market</p>
                    <p className='options-child'>Home</p>
                    <p className='options-child'>Contact</p>
                </div>
            </div>
            <div className="section">
                <div className='upper-text'><h1>Trending Tickets.</h1></div>
                <div className='window-section' id='buying-window-section'>
                    <div className='window'><div className='white-space'></div><button className='buy' onClick={generateTicketButton}>Buy</button></div>
                </div>
               
            </div>
            <div className="section">
                <div className='upper-text'><h1>Your Tickets.</h1></div>
                <div className='window-section' id='owned-window-section'>
                    <div className='window'><div className='white-space'></div>
                    <div className='bought-window-buttons'>
                        <button className='sell' onClick={ResellTicketButton}>Sell</button><button className='info'>Info</button></div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className='upper-text'><h1>Your Tickets Which Are On Sale</h1></div>
                <div className='window-section' id="cancel-resell">
                    <div className='window'><div className='white-space'></div>
                    <div className='bought-window-buttons'>
                        <button className='sell' onClick={CancelResellButton}>Cancel</button></div>
                    </div>
                </div>
            </div>
            <div className="section">
                <div className='upper-text'><h1>Buy Tickets On Resale.</h1></div>
                <div className='window-section' id="buy-from-resell">
                    <div className='window'><div className='white-space'></div>
                    <div className='bought-window-buttons'>
                        <button className='buy' onClick={BuyTicketsOnReSaleButton}>Buy</button><button className='info'>Info</button></div>
                    </div>
                </div>
            </div>

        </div>


    )

}

export default Tickter;