import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore';


const firebaseConfig = {
  apiKey: "AIzaSyClIWMNYL-2b_KNys3Neoi9ZIxwDxJqrmc",
  authDomain: "swiggy-ae0b2.firebaseapp.com",
  projectId: "swiggy-ae0b2",
  storageBucket: "swiggy-ae0b2.appspot.com",
  messagingSenderId: "776344570622",
  appId: "1:776344570622:web:a137647425ea0747a233af",
  measurementId: "G-SECCY47X2G",
};

firebase.initializeApp(firebaseConfig);
export default firebase