const express = require('express');
const ethers = require('ethers');
const ContractAbi = require('../artifacts/contracts/Lock.sol/CoinCircles.dbg.json');
const axios = require('axios')
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());

const contractAddress = '0xf7C728CED9D6a68E8e08f0aF136A34Cf617130B6';

app.post('/contribute-mpesa', async(req, res) => {
    try {
        const { phoneNumber, contributionAmount, chamaName } = req.body;

        // Validate input
        if (!phoneNumber || !contributionAmount || !chamaName) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        // Call the M-Pesa payment handling function or component
        const paymentSuccessful = await handleMPesaPayment(phoneNumber, contributionAmount);

        if (paymentSuccessful) {
            // Connect to Ethereum provider
            const provider = new ethers.providers.JsonRpcProvider('your-ethereum-rpc-endpoint');
            const signer = provider.getSigner();

            // Get the chama contract instance
            const chamaContract = new ethers.Contract(contractAddress, ContractAbi.abi, signer);

            // Convert contribution amount to Wei
            const amountInWei = ethers.utils.parseEther(contributionAmount);

            // Call the contributeFunds function on the contract
            const tx = await chamaContract.contributeFunds(chamaName, { value: amountInWei });
            await tx.wait();

            // Update the user's contribution status and chama details accordingly
            // ...

            // Return a success response
            return res.status(200).json({ message: 'M-Pesa contribution successful' });
        } else {
            return res.status(500).json({ error: 'M-Pesa payment failed' });
        }
    } catch (error) {
        console.error('Error during M-Pesa contribution:', error);
        return res.status(500).json({ error: 'Error during M-Pesa contribution' });
    }
});
async function handleMPesaPayment(phoneNumber, contributionAmount) {
    try {
        // Step 1: Generate an access token
        const accessToken = await generateAccessToken();

        // Step 2: Initiate the M-Pesa transaction
        const transactionResponse = await initiateTransaction(accessToken, phoneNumber, contributionAmount);

        // Step 3: Check the transaction status
        const transactionStatus = await checkTransactionStatus(accessToken, transactionResponse.TransactionID);

        // Step 4: Process the transaction result
        if (transactionStatus.ResultCode === '0') {
            // Transaction successful
            return true;
        } else {
            // Transaction failed
            return false;
        }
    } catch (error) {
        console.error('Error during M-Pesa payment:', error);
        return false;
    }
}

async function generateAccessToken() {
    const consumerKey = '1bWg5fI103vrTMgqSGDtQiRHa4OPvBTejchsZxZgpWLICBPL';
    const consumerSecret = 'uZYGDwYugSWe07kO8VcE4HW2MdYJo6J7C1GRsZTLcXi8LzycBo0uA4VtzbabxMUU';

    const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
        auth: {
            username: consumerKey,
            password: consumerSecret
        }
    });

    return response.data.access_token;
}

async function initiateTransaction(accessToken, phoneNumber, amount) {
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    const data = {
        "BusinessShortCode": "174379",
        "Password": "MTc0Mzc5YmZiMjc5ZjlhYTliZGJjZjE1OGU5N2RkNzFhNDY3Y2QyZTBjODkzMDU5YjEwZjc4ZTZiNzJhZGExZWQyYzkxOTIwMjQwNjExMDEwMjQz",
        "Timestamp": "20230611123456",
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phoneNumber,
        "PartyB": "174379",
        "PhoneNumber": phoneNumber,
        "CallBackURL": "https://your-callback-url.com",
        "AccountReference": "CoinCircles",
        "TransactionDesc": "Contribution to Chama"
    };

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', data, config);
    return response.data;
}

async function checkTransactionStatus(accessToken, transactionId) {
    const config = {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    };

    const data = {
        "TransactionID": transactionId
    };

    const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query', data, config);
    return response.data;
}

app.listen(5000, () => {
    console.log('Server started on port 5000');
});