import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export const round = 1;

const firebaseConfig = {
    apiKey: "AIzaSyAFis3Yqk15WrwDhsaFXEY97x5hPO7vutk",
    authDomain: "cararra-ctf-2.firebaseapp.com",
    projectId: "cararra-ctf-2",
    storageBucket: "cararra-ctf-2.appspot.com",
    messagingSenderId: "184543006158",
    appId: "1:184543006158:web:61dccab08f5f2eac2c6f9f",
    measurementId: "G-K27G5SJLZK"
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
  db.collection(`rounds/${round}/users`).doc(user.uid).set({
    username: username,
    fullName: user.displayName,
    emailList: emailList,
    createdTimestamp: firebase.firestore.FieldValue.serverTimestamp(),
  });
  db.collection(`rounds/${round}/submissions`).doc(user.uid).set({});
};

export const submitFlag = (user, problem, flag) => {
  getBot();
  let updateMap = {};
  updateMap[problem] = {
    problem: problem,
    flag: flag,
  };
  db.collection(`rounds/${round}/submissions1`).doc(user.uid).update(updateMap);
};
