import axios from 'axios'; // or any other library for making HTTP requests

// export const handleMPesaPayment = async(amount) => {
//     try {
//         // Replace these with the appropriate credentials and configurations
//         // provided by the third-party M-Pesa integration service
//         const apiUrl = 'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
//         const apiKey = 'your_api_key';
//         const merchantId = 'your_merchant_id';

//         // Build the request payload according to the service provider's requirements
//         const payload = {
//             amount,
//             merchantId,
//             // Add any other required fields
//         };

//         // Make the API call to initiate the M-Pesa payment
//         const response = await axios.post(apiUrl, payload, {
//             headers: {
//                 'Authorization': `Bearer ${apiKey}`,
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Handle the response from the service provider
//         if (response.data.status === 'success') {
//             // Display a modal or prompt to guide the user through the M-Pesa payment process
//             const paymentConfirmed = await handleMPesaPaymentModal(response.data.checkoutId);

//             if (paymentConfirmed) {
//                 // Payment successful
//                 return true;
//             } else {
//                 // Payment canceled or failed
//                 return false;
//             }
//         } else {
//             // Error handling
//             console.error('M-Pesa payment error:', response.data.error);
//             return false;
//         }
//     } catch (error) {
//         console.error('Error during M-Pesa payment:', error);
//         return false;
//     }
// };

export const handleMPesaPayment = async(amount) => {
    try {
        // Replace these with the appropriate credentials and configurations
        // provided by the Safaricom Daraja API
        const apiUrl = 'https://api.safahttps://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequestricom.co.ke/mpesa/stkpush/v1/processrequest';
        const apiKey = 'your_daraja_api_key';
        const merchantId = 'your_merchant_id';
        const passKey = 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919'; // Provided by Safaricom

        // Build the request payload according to the Daraja API requirements
        const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14);
        const password = Buffer.from(`${merchantId}${passKey}${timestamp}`).toString('base64');

        const payload = {
            BusinessShortCode: merchantId,
            Password: password,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: amount * 100, // Amount in cents
            PartyA: '254708374149', // Replace with the customer's phone number
            PartyB: merchantId,
            PhoneNumber: '254708374149', // Replace with the customer's phone number
            CallBackURL: 'https://your-callback-url.com/callback',
            AccountReference: 'Contribution',
            TransactionDesc: 'Chama Contribution',
        };

        // Make the API call to initiate the M-Pesa payment
        const response = await axios.post(apiUrl, payload, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
        });

        // Handle the response from the Daraja API
        if (response.data.ResponseCode === '0') {
            // Display a modal or prompt to guide the user through the M-Pesa payment process
            const paymentConfirmed = await handleMPesaPaymentModal(response.data.CheckoutRequestID);

            if (paymentConfirmed) {
                // Payment successful
                return true;
            } else {
                // Payment canceled or failed
                return false;
            }
        } else {
            // Error handling
            console.error('M-Pesa payment error:', response.data.ResponseDescription);
            return false;
        }
    } catch (error) {
        console.error('Error during M-Pesa payment:', error);
        return false;
    }
};
export const handleMPesaPaymentModal = async(checkoutId) => {
    return new Promise((resolve) => {
        const modal = document.createElement('div');
        modal.classList.add('mpesa-payment-modal');

        const modalContent = document.createElement('div');
        modalContent.classList.add('mpesa-payment-modal-content');

        const instructions = document.createElement('p');
        instructions.textContent = 'Please complete the following M-Pesa payment instructions:';
        modalContent.appendChild(instructions);

        const paymentInstructions = document.createElement('div');
        paymentInstructions.innerHTML = `
        <p>1. Go to your M-Pesa menu</p>
        <p>2. Select "Lipa Na M-Pesa"</p>
        <p>3. Enter the Checkout ID: <strong>${checkoutId}</strong></p>
        <p>4. Enter your M-Pesa PIN to confirm the payment</p>
      `;
        modalContent.appendChild(paymentInstructions);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Payment Confirmed';
        confirmButton.addEventListener('click', () => {
            resolve(true);
            modal.remove();
        });

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', () => {
            resolve(false);
            modal.remove();
        });

        modalContent.appendChild(confirmButton);
        modalContent.appendChild(cancelButton);

        modal.appendChild(modalContent);
        document.body.appendChild(modal);
    });
};