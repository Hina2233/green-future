// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9MWSTPxgTFJ7bEgbbX5ryqSm5TN_2-90",
  authDomain: "ideas-collection-78cee.firebaseapp.com",
  projectId: "ideas-collection-78cee",
  storageBucket: "ideas-collection-78cee.firebasestorage.app",
  messagingSenderId: "1039207541051",
  appId: "1:1039207541051:web:82a443e942d462f3d6af1e",
  measurementId: "G-RYXVWSYP3W"
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;