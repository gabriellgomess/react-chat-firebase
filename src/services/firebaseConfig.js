import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVtg1PXcyzZmL9l4Lrw2p46srsmHhfl4I",
  authDomain: "react-chat-97706.firebaseapp.com",
  projectId: "react-chat-97706",
  storageBucket: "react-chat-97706.appspot.com",
  messagingSenderId: "438266741742",
  appId: "1:438266741742:web:a65c36c12747bc134944ff",
  measurementId: "G-Y2KNBCJDM4"
};


export const app = initializeApp(firebaseConfig);
export const databaseApp = getFirestore(app);


