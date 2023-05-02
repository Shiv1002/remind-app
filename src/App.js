
import { useEffect, useState } from 'react';
import './App.css';
import Remind from './Remind';
import auth from './Firebase'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import axios from 'axios';

function App() {
  const [user,setUser] = useState({uid:localStorage.getItem("userUid"),email:localStorage.getItem("userEmail")})
  const [isLogged, setIsLogged] = useState(false)
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useEffect(()=>{
    if (localStorage.getItem("userUid")){
      setIsLogged(true)
    }else{
      console.log("No user found ")
    }
  },[])

  const clearInput=()=>{
    setEmail("")
    setPassword("")
    setPasswordError("")
    setEmailError("")
    
  }

  const setLogin = () => {
    setIsLogged(true)
  }
  const setLogout = () => {
    clearInput()
    setIsLogged(false)
    setUser()
    localStorage.removeItem("userUid")
    localStorage.removeItem("userEmail")
  }
  
  const handleLogin =()=>{
    //userCredentials->user->uid
    //userCredentials->user->email
    signInWithEmailAndPassword(auth,email,password)
    .then((userCred)=>
    {
      console.log(userCred.user.uid)
      setUser(userCred.user)
      setLogin()
      localStorage.setItem("userUid",userCred.user.uid)
      localStorage.setItem("userEmail",userCred.user.email)
    }
  )
    .catch((err)=>{
      console.log(err)
      switch(err.code){
          case "auth/invalid-email":
            setEmailError("Invalid email")
            break
          case "auth/user-disabled":
            setEmailError("Permission blocked")
            break
          case "auth/user-not-found":
            setEmailError("User not found"); 
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
          default:
      }
    })
  }
  
  const signUp=()=>{
    createUserWithEmailAndPassword(auth,email,password)
    .then((userCred)=>{ 
      console.log('Created user',userCred.user.uid)
      setUser(userCred.user)
      axios.post('https://reminderserver-production.up.railway.app/user/postUser',{uid:userCred.user.uid,reminders:[],email:userCred.user.email})
      .then((rs)=>{
        console.log(rs)
        localStorage.setItem("userUid",userCred.user.uid)
        localStorage.setItem("userEmail",userCred.user.email)
      })
      .catch((err)=>console.log(err))
      
      setLogin()
    })
    .catch((err)=>{
      console.log(err)
    })
  }
  return ( 
    <div className="">{
      isLogged ?
      <>
      <span className='d-flex justify-content-end'><button className='btn position-absolute btn-success z-3 m-2 ' onClick={setLogout}>logout</button></span>
      
      <Remind  User={user}/>
      </>
        :
        <div className='container  my-5 p-4 rounded-4 col-xl-4 col-md-6 col-sm-8 col-xs-6  '>
        <div className='login_page d-flex flex-column align-items-center p-2'>
          
          <input type='email' value={email} autoFocus required placeholder='Email' onChange={(e)=>setEmail(e.target.value)}/>
          <span className="errorMsg">{emailError}</span>
          <input type='password' value={password} required placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
          {/* <button className='btn btn-success' onClick={setLogin}>login</button> */}
          <span className="errorMsg">{passwordError}</span>
          <button  onClick={handleLogin}>Login</button>
          <button onClick={signUp}>Sign up</button>
        </div>
        </div>
        
    }

    </div>
  );
}

export default App;
