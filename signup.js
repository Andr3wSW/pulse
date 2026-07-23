import {auth, db} from "./firebase.js";


import {
createUserWithEmailAndPassword
}
from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


import {
doc,
setDoc,
collection,
query,
where,
getDocs
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


// Check username format

const usernameRegex =
/^[A-Za-z0-9_.]{3,20}$/;

if(!usernameRegex.test(username)){

    alert(
        "Username must be 3-20 characters and may only contain letters, numbers, periods, and underscores."
    );

    return;

}



// Check username uniqueness

const usernameLower =
username.trim().toLowerCase();

const q = query(

    collection(db,"users"),

    where(
        "usernameLower",
        "==",
        usernameLower
    )

);


const snapshot =
await getDocs(q);


if(!snapshot.empty){

    alert("That username is already taken.");

    return;

}


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

firstName:
firstName.trim(),

lastName:
lastName.trim(),

username:
username.trim(),

usernameLower,

email:
email.trim().toLowerCase(),

createdAt:
Date.now()

}
);



window.location.href="index";


});