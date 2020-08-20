// 'use strict';
const Mailgen = require("mailgen");

let mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "mailgun-impelementation-boilerplate",
    link:
      "https://timedotcom.files.wordpress.com/2018/04/japanese-forest-bathing.jpg",
    logo: process.env.MAIL_LOGO_FOR_VISITOR
  }
});

module.exports = {
  otpSendingEmail: function(code, visitoremail) {
    this.code = code;
    this.email = visitoremail;
    let email = {
      body: {
        intro:
          "This is your Code to view download the Tender document that you requested. Please copy and paste it back in the ap-port site",
        action: {
          button: {
            color: "#22BC66", // Optional action button color
            text: code
          }
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help."
      }
    };
    email.body.name = visitoremail;
    return mailGenerator.generate(email);
  }
};
