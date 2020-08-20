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

According to the repo's documentation, this is what the waterfall does - "Runs an array of functions in series, each passing their results to the next in the array. However, if any of the functions pass an error to the callback, the next function is not executed and the main callback is immediately called with the error."

And about the callback passed to 'generateTemplate()' function - The documentataion says - This is an optional callback to run once all the functions have completed. This will be passed the results of the last task's callback. Invoked with (err, [results]).


module.exports = {
  sendOTPToVisitor: data => {
    mailgun.messages().send(data, (err, body) => {
      console.log(body);
    });
  }
};

2> async-waterfall vs async-series
 https://stackoverflow.com/questions/9258603/what-is-the-difference-between-async-waterfall-and-async-series

It appears that async.waterfall allows each function to pass its results on to the next function, while async.series passes all results to the final callback. At a higher level, async.waterfall would be for a data pipeline ("given 2, multiply it by 3, add 2, and divide by 17"), while async.series would be for discrete tasks that must be performed in order, but are otherwise separate.


Both functions pass the return value, of every function to the next, then when done will call the main callback, passing its error, if an error happens.

The difference is that in async.series(), once the series have finished, will pass all the results to the main callback. async.waterfall() will pass to the main callback ONLY the result of the LAST function called.

3> If async package is required anymore now that we have ES6-Promise - async.js is a vast tool suite and provides much more useful methods (especially for handling concurrency) than the builtin promise methods. But sure, you won't need anything like waterfall or series when working with promises

4> Step by Step explanataion of the above code within async.waterfall - The first function generateTemplate() will return the 'mail' variable. And that will be passed to the second function sendMail(mail, callback) which will further work with that.

*/
