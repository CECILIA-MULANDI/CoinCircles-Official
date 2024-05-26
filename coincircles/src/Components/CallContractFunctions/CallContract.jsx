import Web3 from 'web3';
import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { ContractAddress } from "../Constants/Constants";

export const connectUser = async (setWalletAddress, setIsConnected, setContract, setProvider, setError) => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3 = new Web3(window.ethereum);
        setProvider(web3);
        const contractAddress = ContractAddress; // Replace with your contract address
        const contract = new web3.eth.Contract(ContractAbi.abi, contractAddress);
        setContract(contract);
        const accounts = await web3.eth.getAccounts();
        const connected = await contract.methods.users(accounts[0]).call();
        if (connected.isConnected) {
          setIsConnected(true);
          setWalletAddress(accounts[0]);
        } else {
          const tx = await contract.methods.connect_user().send({ from: accounts[0] });
          console.log('Transaction hash:', tx.transactionHash);
          // Wait for the transaction to be mined
          await new Promise((resolve, reject) => {
            web3.eth.sendSignedTransaction(tx.rawTransaction)
              .once('receipt', (receipt) => {
                console.log('Transaction confirmed:', receipt.transactionHash);
                resolve();
              })
              .on('error', (error) => {
                console.error('Error sending transaction:', error);
                reject(error);
              });
          });
          setWalletAddress(accounts[0]);
          setIsConnected(true);
        }
      } catch (err) {
        setError('Error connecting to wallet');
        console.log(err);
      }
    } else {
      setError('Please install MetaMask');
      console.log('Please install MetaMask');
    }
  };

export const disconnectWallet = (setWalletAddress) => {
    setWalletAddress(null);
};

export const CreateChamas = async (_name, _purpose, _maxNoPeople, _minDeposit, _visibility, setSuccessMessage) => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

    try {
        const tx = await contract.methods.create_chama(_name, _maxNoPeople, _visibility, _minDeposit).send({ from: accounts[0] });
        contract.once('ChamaCreated', (chamaId, name) => {
            setSuccessMessage(`Chama ${name} created successfully with ID ${chamaId}`);
        });
        console.log('Chama created successfully');
    } catch (e) {
        console.log(e);
    }
};

// Function to join a Chama
export const joinChama = async (_name, setSuccessMessage, setErrorMessage) => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

    try {
        const tx = await contract.methods.join_chama(_name).send({ from: accounts[0] });
        contract.once('UserJoinedChama', (name, user_address) => {
            setSuccessMessage(`User ${user_address} joined Chama ${name}`);
        });
        console.log('User joined Chama successfully');
    } catch (e) {
        setErrorMessage('Error joining Chama');
        console.log(e);
    }
};

// Function to contribute funds to a Chama
export const contributeFunds = async (_name, _amount, setSuccessMessage, setErrorMessage) => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

    try {
        const tx = await contract.methods.contributeFunds(_name).send({ from: accounts[0], value: web3.utils.toWei(_amount, 'ether') });
        contract.once('ContributionMade', (name, user_address, amount) => {
            setSuccessMessage(`Contribution of ${web3.utils.fromWei(amount, 'ether')} made by ${user_address} to Chama ${name}`);
        });
        console.log('Contribution made successfully');
    } catch (e) {
        setErrorMessage('Error contributing funds');
        console.log(e);
    }
};

// Function to vote for a recipient
export const voteForRecipient = async (_name, _recipient, setSuccessMessage, setErrorMessage) => {
    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

    try {
        const tx = await contract.methods.voteForRecipient(_name, _recipient).send({ from: accounts[0] });
        contract.once('VoteCast', (name, voter, recipient) => {
            setSuccessMessage(`Vote cast by ${voter} for ${recipient} in Chama ${name}`);
        });
        console.log('Vote cast successfully');
    } catch (e) {
        setErrorMessage('Error voting for recipient');
        console.log(e);
    }
};

// Function to get all Chamas
export const getAllChamas = async (setChamas, setErrorMessage) => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(ContractAbi.abi, ContractAddress);

    try {
        const chamas = await contract.methods.getAllChamas().call();
        setChamas(chamas);
        console.log('Chamas retrieved successfully');
    } catch (e) {
        setErrorMessage('Error retrieving Chamas');
        console.log(e);
    }
};  