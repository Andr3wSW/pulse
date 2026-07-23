import { checkAuth } from "./auth.js";

import { db } from "./firebase.js";

import {
doc,
getDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";




checkAuth()

.then(async(user)=>{


const userRef =
doc(
db,
"users",
user.uid
);


const userSnap =
await getDoc(userRef);



if(userSnap.exists()){


const data =
userSnap.data();



const displayName =
data.firstName +
(
data.lastName
?
" " + data.lastName
:
""
);



document
.getElementById("profileName")
.textContent =
displayName;



document
.getElementById("profileInitial")
.textContent =
data.firstName
.charAt(0)
.toUpperCase();



}



});