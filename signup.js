import {auth, db} from "./firebase.js";


import {
createUserWithEmailAndPassword
}
from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {
doc,
setDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const form =
document.querySelector("form");



form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const firstName =
document.querySelector("#firstName").value;


const lastName =
document.querySelector("#lastName").value;


const username =
document.querySelector("#username").value;


const email =
document.querySelector("#email").value;


const password =
document.querySelector("#password").value;



const userCredential =
await createUserWithEmailAndPassword(
auth,
email,
password
);



const user =
userCredential.user;



await setDoc(
doc(db,"users",user.uid),
{

firstName,

lastName,

username,

email,

createdAt:
Date.now()

}

);



window.location.href="index";


});