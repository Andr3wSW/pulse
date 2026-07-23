import { auth } from "./firebase.js";


import {

signInWithEmailAndPassword

}

from

"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



const form =
document.querySelector("form");



form.addEventListener(
"submit",
async(e)=>{


e.preventDefault();



const email =
document.querySelector("#email").value;


const password =
document.querySelector("#password").value;



try{


await signInWithEmailAndPassword(

auth,

email,

password

);



window.location.href="app";


}


catch(error){


console.error(error);



alert(
"Incorrect email or password."
);


}



});