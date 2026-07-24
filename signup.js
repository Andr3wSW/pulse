import {auth, db} from "./firebase.js";

console.log("Signup JS loaded");


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

const termsAgree =
document.getElementById("termsAgree");


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

if(!termsAgree.checked){

alert(
"You must agree to the Pulse Terms of Use before creating an account."
);

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

    firstName:firstName,

    lastName:lastName,


    username:username,


    usernameLower:
    username.toLowerCase(),


    email:email,


    searchTerms:[

        firstName.toLowerCase(),

        ...(lastName
        ?
        [lastName.toLowerCase()]
        :
        []),


        (
        firstName + " " + lastName
        )
        .toLowerCase(),


        username.toLowerCase()

    ]

}
);



window.location.href="index";


});