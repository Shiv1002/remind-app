import React, { useEffect } from 'react'
import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';
import TimePicker from 'react-time-picker';
import { faTrash, faClock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
function Remind({User}) {

 
  const [allRemind, setAllRemind] = useState([])
  const [startDate, setStartDate] = useState(new Date());
  const [time, setTime] = useState('00:00');
   const [reminder, setReminder] = useState({ text: "", date:startDate, time: '00:00' });

  useEffect(()=>{
    //start getting data of user
    
    axios.post(process.env.backend+'/user/getUser',{uid:User.uid})
    .then((res)=>{setAllRemind(res.data[0].reminders);})
    .catch((err)=>console.log(err))
  },[User])

  const delRemind = (index) => { 
    var reminderName = 0
    setAllRemind(allRemind.filter((ele, i) => { if (i !== index){ return true }else{reminderName = ele.text; return false}}))
    console.log(reminderName)
    //sending update requesst to database
    // sending 0 as parameter to delete reminder with namee
    axios.post(process.env.backend+`/user/${User.uid}/0`,{reminderName})
    .then((rs)=>console.log(rs.data))
    .catch((err)=>console.log(err))

  }
  const addRemind = () => { 
    setAllRemind([...allRemind,  reminder])
    console.log(allRemind)
    //sending update requesst to database
    // sending 1 as parameter to add reminder
    axios.post(process.env.backend+`/user/${User.uid}/1`,reminder)
    .then((rs)=>console.log(rs.data))
    .catch((err)=>console.log(err))

    setStartDate(new Date())
    setReminder({ ...reminder, text: "", date: startDate })
    
  }

  return (
    <div className='main_page '>
          {User.email}
          <div className='list  bg-light p-2 m-2 rounded-2'>
            {allRemind.length > 0 ?
              <ul>{
                allRemind.map((ele, index) => {
                  return <li className='d-flex justify-content-between' key={ele.text} >
                    <div>
                      <h2>{ele.text}</h2>
                      <span>{Object.values(ele.date).join("/")}</span>
                      <span>{ele.time}</span>
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className='d-flex align-items-center'>
                      <FontAwesomeIcon style={{ color: '#cc1c1c' }} icon={faTrash} size='xl' className='del' onClick={(e) => delRemind(index)} />
                    </div>
                  </li>
                })
              }
              </ul>
              : <h4>No Reminders...</h4>}
          </div>

          <div className='add_reminder p-4 bg-dark m-2 rounded-4'>
            <input type='text' className='m-2 py-2 rounded-2' placeholder='Enter a reminder..' value={reminder.text} onChange={(e) => setReminder({ ...reminder, text: e.target.value })} />

            <DatePicker selected={startDate} className='m-2 py-2 rounded-2' onChange={(date) => {
              setStartDate(date)
              setReminder({ ...reminder, date: { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() } })
              console.log(reminder)
            }} />
            <TimePicker className="timepicker m-2 py-2" value={time} onChange={(newTime) => {
              setTime(newTime)
              setReminder({ ...reminder, time: newTime })
              console.log(time)
            }} />
            <div>
              <button className='btn btn-success' onClick={() => addRemind()}>Add</button>
            </div>

          </div>

        </div>
  )
}

export default Remind