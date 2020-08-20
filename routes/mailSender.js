"use strict";
const async = require("async");
const mailCompose = require("./mailCompose");

var mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API,
  domain: process.env.MAILGUN_DOMAIN
});

// var mail = {
//   from: "Excited User <me@samples.mailgun.org>",
//   to: "",
//   subject: "",
//   text: "Testing some Mailgun awesomeness!"
// };

module.exports = {
  // Email to send when user with the generated OTP
  sendOTPToVisitor: function(email, generatedCode) {
    this.email = email;
    this.generatedCode = generatedCode;

    new Promise((resolve, reject) => {
      var mail = {
        from: "Excited User <me@samples.mailgun.org>",
        to: email,
        subject:
          "One time Code to view download the document that you requested",
        text: "Testing some Mailgun awesomeness!",
        html: mailCompose.otpSendingEmail(generatedCode, email)
      };

      mailgun.messages().send(mail, function(err) {
        if (err) {
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  }
};

/*
1> https://caolan.github.io/async/docs.html#waterfall
waterfall will take both anonymous function or named function in its chain of function execution - In above, sendMail() is my named function that I am declaring within the async

According to the repo, this is what the waterfall does - "Runs an array of functions in series, each passing their results to the next in the array. However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error."


module.exports = {
  sendOTPToVisitor: data => {
    mailgun.messages().send(data, (err, body) => {
      console.log(body);
    });
  }
};


*/
