const express = require('express');
const bodyParser = require("body-parser");
const request = require('request');
const https = require('https');

const app = express();

// static folder that has all our local files
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

app.post('/', (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);

  const url = 'https://us11.api.mailchimp.com/3.0/lists/0e8f825231';

  const options = {
    method: "POST",
    auth: "shlok1:f3dc916118b87592325eb94903016209-us11"
  };

  const request = https.request(url, options, (response) => {
    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/public/success.html");
    } else {
      res.sendFile(__dirname + "/public/failure.html");
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
})


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});


app.post("/failure", (req, res) => {
  res.redirect('/');
});

// API KEY
// f3dc916118b87592325eb94903016209-us11

// Audience ID or List ID
// 0e8f825231