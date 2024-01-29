import React, { useEffect, useMemo } from "react";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";
import "react-clock/dist/Clock.css";
import TimePicker from "react-time-picker";
import { faTrash, faClock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import axios from "axios";
function Remind({ User, showToast }) {
  const [isLoading, setLoading] = useState(false);
  const [allRemind, setAllRemind] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [time, setTime] = useState("00:00");
  const [index, setIndex] = useState(0);
  const init = useMemo(() => {
    return {
      text: "",
      date: new Date(),
      time: "00:00",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.toString(),
    };
  }, []);
  const [reminder, setReminder] = useState(init);
  const [isDisabled, setDisabled] = useState(true);
  useEffect(() => {
    //start getting data of user
    console.log(process.env.BACKURL, "is pinnged");
    setLoading(true);
    axios
      .post(process.env.REACT_APP_BACKEND + "/user/getUser", { uid: User.uid })
      .then((res) => {
        console.log(res);
        setAllRemind(res.data[0].reminders);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [User]);
  useEffect(() => {
    for (var obj in reminder) {
      if (obj !== "timezone" && obj !== "time" && reminder[obj] === init[obj]) {
        setDisabled(true);
        // console.log(obj)
        return;
      }
      setDisabled(false);
    }
  }, [reminder, init]);

  const delRemind = (index) => {
    //get confirm kill
    document.getElementsByClassName("delete")[0].classList.toggle("d-none");
    setIndex(index);
  };

  const addRemind = () => {
    if (reminder.text === "") {
      showToast("Enter something to be remind of");
      return;
    }
    setAllRemind([...allRemind, reminder]);
    // console.log(allRemind)
    //sending update requesst to database
    // sending 1 as parameter to add reminder
    axios
      .post(REACT_APP_BACKEND + `/user/${User.uid}`, reminder)
      .then((rs) => console.log(rs.data))
      .catch((err) => console.log(err));

    setStartDate(init.date);
    setReminder(init);
  };
  const confirmDel = (index) => {
    var reminderName = 0;
    setAllRemind(
      allRemind.filter((ele, i) => {
        if (i !== index) {
          return true;
        } else {
          reminderName = ele.text;
          return false;
        }
      })
    );
    console.log(reminderName);
    //sending update requesst to database
    // sending 0 as parameter to delete reminder with namee
    axios
      .delete(`/user/${User.uid}`, { reminderName })
      .then((rs) => console.log(rs.data))
      .catch((err) => console.log(err));

    document.getElementsByClassName("delete")[0].classList.toggle("d-none");
    setIndex(0);
  };
  return (
    <div className="main_page mx-auto col-lg-8 col-md-10 col-sm-12">
      <div className="placeholders"></div>
      <span className="text-light">Signed In as</span>
      <h5 className="text-light">{User.email}</h5>
      <div className="list  p-2 mt-3 mx-2 rounded-2">
        {isLoading ? (
          <Stack spacing={1}>
            <Skeleton variant="rounded-4" height={100} />
            <Skeleton variant="rounded" height={100} />
          </Stack>
        ) : allRemind.length > 0 ? (
          <ul>
            {allRemind.map((ele, index) => {
              return (
                <li className="d-flex justify-content-between" key={ele.text}>
                  <div>
                    <h2>{ele.text}</h2>
                    <span>{Object.values(ele.date).join("/")}</span>
                    <span>{ele.time}</span>
                    <FontAwesomeIcon icon={faClock} />
                  </div>
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon
                      style={{ color: "#cc1c1c" }}
                      icon={faTrash}
                      size="xl"
                      className="del"
                      onClick={(e) => delRemind(index)}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="bg-light d-flex justify-content-center p-3 rounded-4">
            <h4 className="">No Reminders Yet...</h4>
          </div>
        )}
      </div>

      <div className="add_reminder p-4 bg-dark m-2 rounded-4">
        <input
          type="text"
          className="m-2 py-2 rounded-2"
          autoFocus
          placeholder="Meeting at 10 O`clock"
          value={reminder.text}
          onChange={(e) => setReminder({ ...reminder, text: e.target.value })}
        />

        <DatePicker
          selected={startDate}
          className="m-2 py-2 rounded-2"
          onChange={(date) => {
            setStartDate(date);
            setReminder({
              ...reminder,
              date: {
                year: date.getFullYear(),
                month: date.getMonth() + 1,
                day: date.getDate(),
              },
            });

            console.log(reminder);
          }}
        />
        <TimePicker
          className="timepicker m-2 py-2"
          value={time}
          onChange={(newTime) => {
            setTime(newTime);
            setReminder({ ...reminder, time: newTime });
            console.log(time);
          }}
        />
        <div>
          <button
            id="addRemind"
            className="btn btn-success"
            disabled={isDisabled}
            onClick={() => addRemind()}
          >
            Add a reminder
          </button>
        </div>
      </div>
      <div className="delete d-none">
        <div
          id="delete-card"
          className="delete-card  d-flex flex-column align-items-center bg-light px-4 py-3"
        >
          <p className="h5">Are you Sure?</p>
          <div className="m-2 ">
            <button
              className="btn mx-2 btn-success"
              onClick={() =>
                document
                  .getElementsByClassName("delete")[0]
                  .classList.toggle("d-none")
              }
            >
              Cancel
            </button>
            <button
              className="btn mx-2 btn-danger"
              onClick={() => confirmDel(index)}
            >
              Confirm
            </button>
          </div>
        </div>
        <div className="overlay"></div>
      </div>
    </div>
  );
}

export default Remind;
