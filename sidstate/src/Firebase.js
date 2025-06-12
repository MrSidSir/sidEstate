// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBjeW8lMljK8XjV1f5MKHu_-zNNngZpW08",
//   authDomain: "sidstate.firebaseapp.com",
//   projectId: "sidstate",
//   storageBucket: "sidstate.firebasestorage.app",
//   messagingSenderId: "120242983159",
//   appId: "1:120242983159:web:e15109643656f7b64f03f2",
//   measurementId: "G-57G0K3033Y"
// };


const firebaseConfig = {
  apiKey: "AIzaSyAXPHL72uhMnHEXfdSISbxeTWoSKlJ1sxA",
  authDomain: "sidstate-38e67.firebaseapp.com",
  projectId: "sidstate-38e67",
  storageBucket: "sidstate-38e67.firebasestorage.app",
  messagingSenderId: "489562598954",
  appId: "1:489562598954:web:cf1e619adf703361205d53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export {app};