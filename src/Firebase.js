// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app"
import {getAuth} from 'firebase/auth'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCKaWVS76ysnNt8zwVF_41Wm3Bd1lyauH8",
  authDomain: "reactreminder-eff94.firebaseapp.com",
  projectId: "reactreminder-eff94",
  storageBucket: "reactreminder-eff94.appspot.com",
  messagingSenderId: "301692081646",
  appId: "1:301692081646:web:6b38ff0fcb63988c752aff"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
export default auth