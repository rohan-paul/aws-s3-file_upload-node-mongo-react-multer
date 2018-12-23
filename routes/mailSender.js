"use strict";
var async = require("async");
var mailCompose = require("./mailCompose");

var mailgun = require("mailgun-js")({
  apiKey: process.env.MAILGUN_API,
  domain: process.env.MAILGUN_DOMAIN
});

var mail = {
  from: "Excited User <me@samples.mailgun.org>",
  to: "",
  subject: "",
  text: "Testing some Mailgun awesomeness!"
};

module.exports = {
  sendOTPToVisitor: function(email, generatedCode) {
    this.email = email;
    this.generatedCode = generatedCode;
    async.waterfall(
      [
        function generateTemplate(callback) {
          mail.to = email;
          mail.subject =
            "One time Code to view download the document that you requested";
          mail.html = mailCompose.otpSendingEmail(generatedCode, email);
          callback(null, mail);
        },
        function sendMail(mail, callback) {
          try {
            mailgun.messages().send(mail, function(err, body) {
              if (err) {
                callback(err);
              } else {
                callback(null, body);
              }
            });
          } catch (e) {
            callback(e);
          }
        }
      ],
      function(err, data) {
        if (err) {
          return console.log(err);
        } else {
          return console.log(data);
        }
      }
    );
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
