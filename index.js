const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const publishableKey = process.env.Publishable_Key;
const secretKey = process.env.Secret_Key;

const stripe = require('stripe')(secretKey);

const PORT = process.env.PORT;

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function (req, res) {
    res.render('Home', {
        key: publishableKey
    })
});

app.post('/payment', async function (req, res) {
    const customer = await stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken,
        name: 'Love',
        address: {
            line1: 'TC 9/4 Old MES colony',
            postal_code: '452331',
            city: 'Indore',
            state: 'Madhya Pradesh',
            country: 'India',
        }
    });

    if(customer) {
        var charge = await stripe.charges.create({
            amount: 2500,
            description: 'Tset charges',
            currency: 'INR',
            customer: customer.id
        })
    }

    if(charge) return res.redirect('https://example.com/success');
    else return res.redirect('https://example.com/cancel')
})

app.listen(PORT, function (error) {
    if (error) throw error;
    console.log(`port is listening at ${PORT}`);
})
