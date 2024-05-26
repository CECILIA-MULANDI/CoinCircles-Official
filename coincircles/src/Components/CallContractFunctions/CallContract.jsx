import ContractAbi from "../../artifacts/contracts/Lock.sol/CoinCircles.json";
import { ContractAddress } from "../Constants/Constants";
import { ethers } from "ethers";

export const connectUser = async (setWalletAddress, setIsConnected, setContract, setProvider, setError) => {
    if (window.ethereum) {
        try {
            let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            let web3provider = new ethers.providers.Web3Provider(window.ethereum);

            setProvider(web3provider);
            const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, web3provider.getSigner(accounts[0]));
            setContract(contract);

            // CHECK IF USER IS CONNECTED
            const connected = await contract.users(accounts[0]);
            if (connected.isConnected) {
                setIsConnected(true);
                setWalletAddress(accounts[0]);
            } else {
                const tx = await contract.connect_user();
                await tx.wait();
                setWalletAddress(accounts[0]);
                setIsConnected(true);
            }
        } catch (err) {
            setError('Error connecting to wallet');
            console.log(err);
        }
    } else {
        setError('Please install Metamask');
        console.log('Please install Metamask');
    }
};

export const disconnectWallet = (setWalletAddress) => {
    setWalletAddress(null);
};

export const CreateChamas = async (_name, _purpose, _maxNoPeople, _minDeposit, _visibility, setSuccessMessage) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);

    try {
        const tx = await contract.create_chama(_name, _maxNoPeople, _visibility, _minDeposit);
        await tx.wait();
        // Listen to events
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);

    try {
        const tx = await contract.join_chama(_name);
        await tx.wait();
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);

    try {
        const tx = await contract.contributeFunds(_name, { value: ethers.utils.parseEther(_amount) });
        await tx.wait();
        contract.once('ContributionMade', (name, user_address, amount) => {
            setSuccessMessage(`Contribution of ${amount} made by ${user_address} to Chama ${name}`);
        });
        console.log('Contribution made successfully');
    } catch (e) {
        setErrorMessage('Error contributing funds');
        console.log(e);
    }
};

// Function to vote for a recipient
export const voteForRecipient = async (_name, _recipient, setSuccessMessage, setErrorMessage) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);

    try {
        const tx = await contract.voteForRecipient(_name, _recipient);
        await tx.wait();
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
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(ContractAddress, ContractAbi.abi, signer);

    try {
        const chamas = await contract.getAllChamas();
        setChamas(chamas);
        console.log('Chamas retrieved successfully');
    } catch (e) {
        setErrorMessage('Error retrieving Chamas');
        console.log(e);
    }
};
