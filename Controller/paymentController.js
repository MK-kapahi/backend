const { generateAccessToken } = require('../utils/commonFunction');
const stripe = require('stripe')('sk_test_51OOKRCSHn7J9oTBWYT2TUX4fS2NO60QpAp3ZsJ6Mfm7nXBy99rcdjRpGJHmBBatiXkJw6DpO9UJxSAhSFk25333C008ZVF8TfH');
require('dotenv').config();


const payAmount = async (req, res) => {

    try {
        const accessToken = await generateAccessToken(process.env.CLIENT_ID, process.env.SECTRET_ID)
        const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders`;
        const payload = {
            intent: "CAPTURE",
            purchase_units: [
                {
                    amount: {
                        currency_code: "USD",
                        value: req.params.price,
                    },
                },

            ],

            "payment_source": {
                "paypal": {
                    "return_url": "http://localhost:3000/processing-page",
                    "cancel_url": "http://localhost:3000/processing-page"
                }
            }
        };
        const response = await fetch(url, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,

            },
            method: "POST",
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            const jsonResponse = await response.json();
            res.send(jsonResponse);
            console.log(jsonResponse);
        } else {
            const errorMessage = await response.text();
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error('Error in payAmount:', error.message);
        res.status(500).json({ error: error.message });
    }
};


const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken(process.env.CLIENT_ID, process.env.SECTRET_ID)

    const url = `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,

        },
    });
    if (response) {

        try {
            const jsonRes = await response.json()
            console.log("capture order", jsonRes)
            return jsonRes;
        } catch (error) {
            console.log(error)
        }
    }
}

const stripePayment = async (req, res) => {

    const { product, User, userAddress } = req.body

    console.log(User)
    try {
        const customer = await stripe.customers.create({
            name: User.name,
            email: User.email,
            address: {
                city: userAddress.City,
                country: userAddress.Country,
                line1: userAddress.Line1,
                line2: userAddress.Line2,
                postal_code: userAddress.PostalCode,
                state: userAddress.State,
            },
        });



        if (customer) {

            const paymentIntent = await stripe.paymentIntents.create({
                amount: product,
                currency: 'USD',
                shipping: {
                    name: User.name,
                    address: {
                        city: userAddress.City,
                        country: userAddress.Country,
                        line1: userAddress.Line1,
                        line2: userAddress.Line2,
                        postal_code: userAddress.PostalCode,
                        state: userAddress.State,
                    },
                },
                automatic_payment_methods: {
                    enabled: true,
                },
                customer: customer.id,
                description: 'Purchase of product from your store',
            });
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        }
    } catch (error) {
        console.error('Error creating PaymentIntent:', error.message);
        res.status(500).json({ error: error.message });
    }
}

module.exports = { stripePayment, payAmount, captureOrder }