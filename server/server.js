require("dotenv").config();
const express = require("express");
const { sendEmailToNewUser, addNewReminderEmail } = require("./Utils/email");
const ejs = require("ejs");
const { DateTime } = require("luxon");
const { Timestamp } = require("mongodb");
const main = require("./DB/db");
const User = require("./Models/User");

const app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

main().catch((err) => console.log(err));

// const dbUrl = "mongodb://localhost:27017/user";

app.post("/user/getUser", async (req, res) => {
  const doc = await User.find({ uid: req.body.uid }).catch((e) => {
    console.log(e);
  });
  res.json(doc);
});

//newuser
app.post("/user/postUser", async (req, res) => {
  const user = new User();
  user.uid = req.body.uid;
  user.reminders = req.body.reminders;
  user.email = req.body.email;
  const doc = await user.save();

  //email to new user
  sendEmailToNewUser(req, res);

  res.json(doc);
});

app.delete("/user/:uid", async (req, res) => {
  const uid = req.params.uid;
  console.log(uid, "requested for delete");
  //delete reminder
  await User.updateOne(
    { uid: uid },
    { $pull: { reminders: { text: req.body.reminderName } } }
  )
    .then((rs) => res.json(rs))
    .catch((err) => rs.json(err));
});

//update reminders of user
app.post("/user/:uid", async (req, res) => {
  const uid = req.params.uid;

  //body format {text:'',date:"",time:""}

  console.log(uid, "reqested for add");

  await User.updateOne(
    { uid: req.params.uid },
    { $push: { reminders: req.body } }
  )
    .then((rs) => res.json(rs))
    .catch((e) => {
      return e;
    });

  const timer = setRemindTime(req.body);
  console.log(timer / 60, "minutes", "timer");

  setTimeout(async () => {
    console.log("sending an email");
    const userEmail = await getEmailFromServer(uid);
    console.log(userEmail);

    //add reminder email
    addNewReminderEmail(req, res, timer, userEmail);
  }, timer * 1000);

  // res.json({"x":req.body,uid})
});

const getEmailFromServer = async (uid) => {
  const email = await User.find({ uid: uid })
    .then((rs) => {
      return rs[0].email;
    })
    .catch((err) => console.log(err));
  return email;
};

const setRemindTime = (date) => {
  console.log(date, "for reminder");
  var now = new Date();
  const recipientTimezone = date.timezone;
  const sendingTime = DateTime.utc(
    now.getFullYear(),
    now.getMonth() + 1,
    now.getDate(),
    now.getHours(),
    now.getMinutes()
  );

  const convertedTime = sendingTime.setZone(recipientTimezone);
  now = convertedTime;
  var yeardiff = date.date["year"] - now.year;
  var mondiff = date.date["month"] - now.month;
  var daydiff = date.date["day"] - now.day;
  var hour = Number(date.time.slice(0, 2)) - now.hour; // returns the hour (from 0 to 23)
  var minutes = Number(date.time.slice(3)) - now.minute; // returns the minutes (from 0 to 59)
  console.log("timedifferences before format");
  console.log(yeardiff, mondiff, daydiff, hour, minutes);
  if (mondiff < 0) {
    mondiff += 12;
    yeardiff -= 1;
  }
  if (daydiff < 0) {
    daydiff += 30;
    mondiff -= 1;
  }
  if (hour < 0) {
    hour = 24 + hour;
    daydiff -= 1;
  }
  if (minutes < 0) {
    minutes = 60 + minutes;
    hour -= 1;
  }
  console.log("timedifferences after format");
  console.log(yeardiff, mondiff, daydiff, hour, minutes);
  minutes *= 60;
  hour *= 60 * 60;
  daydiff *= 24 * 3600;
  mondiff *= 30 * 3600;
  yeardiff *= 365 * 24 * 3600;
  return yeardiff + mondiff + daydiff + hour + minutes;
};

app.get("/", async (req, res) => {
  // const x = await getEmailFromServer(1234)
  // console.log(x)
  res.status(200).send("ok");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  consTz();
  console.log("server started on", port);
});

const consTz = () => {
  //to get current timezone
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(timeZone);
};
