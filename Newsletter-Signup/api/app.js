const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const path = require('path');
require('dotenv').config();


const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, '..', 'public', 'signup.html'));
});

app.post("/", function (req, res) {
    const firstname = req.body.FirstName;
    const lastname = req.body.LastName;
    const email = req.body.Email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstname,
                    LNAME: lastname
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    const apiKey = process.env.MAILCHIMP_API_KEY;
    const list_id = process.env.MAILCHIMP_LIST_ID;

    const url = "https://us22.api.mailchimp.com/3.0/lists/"+list_id; // Replace with your Mailchimp list ID

    const options = {
        method: "POST",
        auth: apiKey // Replace with your Mailchimp API key
    };

    const request = https.request(url, options, function (response) {
        if (response.statusCode === 200) {
            
            res.sendFile(path.join(__dirname, '..', 'public', 'success.html'));
        } else {
            
            res.sendFile(path.join(__dirname, '..', 'public', 'failure.html'));
        }

        response.on("data", function (data) {
            console.log(JSON.parse(data));
        });
    });

    request.write(jsonData);
    request.end();
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});
// This exports the app for Vercel serverless functions
module.exports = app;
