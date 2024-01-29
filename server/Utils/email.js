const nodemailer = require("nodemailer");
const ejs = require("ejs");
//need nodemailer service to send smtp mails
// Simple Mail Transfer Protocol (SMTP) is a technology for sending outgoing emails across networks and is the most common transport method.
var transport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  //set port
  // if not defined it will be undefined
  port: 587,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    //generated with 2-step auth
    pass: process.env.NODEMAILER_EMAIL_PASS,
  },
});
// message = {
//   from: "reminder.keeper@gmail.com",
//   to: "xyz@gmail.co",
//   subject: "repeat",
//   Text:""
//  }

// const message =  {'login':'Welcome to login page'}
// console.log(message.login)

function sendEmailToNewUser(req, res) {
  ejs.renderFile("./Utils/newUser.ejs", function (err, htmlpage) {
    if (err) {
      console.log(err);
      res.status(404).send("Not found");
    } else {
      //send an info mail
      transport.sendMail(
        {
          from: "reminder.keeper@gmail.com",
          to: req.body.email,
          subject: "Successfully logged in",
          html: htmlpage,
        },
        (err, info) => {
          if (err) {
            console.log(err);
          } else {
            console.log(info.response);
          }
        }
      );
    }
  });
}

function addNewReminderEmail(req, res, timer, userEmail) {
  ejs.renderFile(
    "./Utils/reminder.ejs",
    { time: timer / 60, task: req.body.text },
    (err, htmlPage) => {
      if (err) {
        console.log("could not send email", err);
      } else {
        transport.sendMail(
          {
            //message
            from: "reminder.keeper@gmail.com",
            to: userEmail,
            subject: "Reminder",
            html: htmlPage,
          },
          (err, info) => {
            if (err) {
              console.log(err);
            } else {
              console.log(info.response);
            }
          }
        );
      }
    }
  );
}

module.exports = { sendEmailToNewUser, addNewReminderEmail };
