
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
          case "auth/Invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
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
      axios.post('/user/postUser',{uid:userCred.user.uid,reminders:[],email:userCred.user.email})
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
      <button className='btn btn-success' onClick={setLogout}>logout</button>
      <Remind  User={user}/>
      </>
        :
        <div className='login_page'>
          
          <input type='email' value={email} autoFocus required placeholder='Email' onChange={(e)=>setEmail(e.target.value)}/>
          <p className="errorMsg">{emailError}</p>
          <input type='password' value={password} required placeholder='Password' onChange={(e)=>setPassword(e.target.value)}/>
          {/* <button className='btn btn-success' onClick={setLogin}>login</button> */}
          <p className="errorMsg">{passwordError}</p>
          <button onClick={handleLogin}>login</button>
          <button onClick={signUp}>sign up</button>
        </div>
    }

    </div>
  );
}

export default App;
