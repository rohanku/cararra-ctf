import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1ibbAUUiCS1n9vE0PChw0k5tCRwrgJI0",
  authDomain: "cararra-ctf.firebaseapp.com",
  projectId: "cararra-ctf",
  storageBucket: "cararra-ctf.appspot.com",
  messagingSenderId: "6526243120",
  appId: "1:6526243120:web:de4aa75ec2acb977f2f8f5",
  measurementId: "G-FX005C3LVW"
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.firestore();
const provider = new firebase.auth.GoogleAuthProvider();

export const getBot = () => {
  let xmlHttp = new XMLHttpRequest();
  xmlHttp.open("POST", "https://cararra-ctf-submissions-bot.herokuapp.com/", true);
  xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlHttp.send(null);
  xmlHttp.open("POST", "https://cararra-ctf-files.herokuapp.com/", true);
  xmlHttp.setRequestHeader("Access-Control-Allow-Origin", "*");
  xmlHttp.send(null);
};

export const signInWithGoogle = () => {
  getBot();
  auth.signInWithRedirect(provider);
};

export const signOut = () => {
  auth
    .signOut()
    .then(function () {
      // Sign-out successful.
    })
    .catch(function (error) {
      // An error happened.
    });
};

export const addUser = (user, username, emailList) => {
  getBot();
  db.collection("users").doc(user.uid).set({
    username: username,
    fullName: user.displayName,
    emailList: emailList,
    createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  db.collection("submissions").doc(user.uid).set({});
};

export const submitFlag = (user, problem, flag) => {
  getBot();
  let updateMap = {};
  updateMap[problem] = {
    problem: problem,
    flag: flag,
  };
  db.collection("submissions").doc(user.uid).update(updateMap);
};
