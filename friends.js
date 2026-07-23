import { db, auth } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
addDoc,
serverTimestamp,
onSnapshot,
doc,
getDoc,
deleteDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// Elements

const searchInput =
document.getElementById("friendSearch");

const results =
document.getElementById("searchResults");

const requests =
document.getElementById("incomingRequests");

const friendsList =
document.getElementById("friendsList");





// ==========================
// SEARCH USERS
// ==========================


let timeout;


searchInput.addEventListener(
"input",
()=>{


clearTimeout(timeout);



timeout =
setTimeout(
searchUsers,
300
);



});





async function searchUsers(){


const value =
searchInput.value
.trim()
.toLowerCase();



results.innerHTML="";



if(value.length < 2)
return;



const usersRef =
collection(db,"users");



const q =
query(

usersRef,

where(
"searchTerms",
"array-contains",
value

)

);



const snapshot =
await getDocs(q);



snapshot.forEach(userDoc=>{


const user =
userDoc.data();


const uid =
userDoc.id;



// Don't show yourself

if(uid === auth.currentUser.uid)
return;



const div =
document.createElement("div");



div.className =
"friend-result";



div.innerHTML = `

<div>

<strong>
${user.firstName}
${user.lastName ? user.lastName : ""}
</strong>

<br>

@${user.username}

</div>


<button class="primary">

Add Friend

</button>

`;



div.querySelector("button")
.onclick =
()=>sendRequest(uid);



results.appendChild(div);



});


}







// ==========================
// SEND REQUEST
// ==========================


async function sendRequest(uid){


const current =
auth.currentUser.uid;



// check existing requests

const existing =
query(

collection(
db,
"friendRequests"
),

where(
"from",
"==",
current
),

where(
"to",
"==",
uid
)

);



const snap =
await getDocs(existing);



if(!snap.empty){

alert("Request already sent");

return;

}




await addDoc(

collection(
db,
"friendRequests"
),

{

from:current,

to:uid,

status:"pending",

createdAt:
serverTimestamp()

}

);



alert("Friend request sent");

}





// ==========================
// INCOMING REQUESTS
// ==========================


onSnapshot(

query(

collection(
db,
"friendRequests"
),

where(
"to",
"==",
auth.currentUser.uid
),

where(
"status",
"==",
"pending"
)

),

(snapshot)=>{


requests.innerHTML="";



snapshot.forEach(async(request)=>{


const data =
request.data();



const sender =
await getDoc(

doc(
db,
"users",
data.from
)

);



const user =
sender.data();



const div =
document.createElement("div");



div.className =
"friend-result";



div.innerHTML = `

<div>

<strong>
${user.firstName}
</strong>

<br>

@${user.username}

</div>


<button class="primary accept">

Accept

</button>


<button class="secondary decline">

Decline

</button>

`;



div.querySelector(".accept")
.onclick =
()=>acceptRequest(
request.id,
data.from
);



div.querySelector(".decline")
.onclick =
()=>declineRequest(
request.id
);



requests.appendChild(div);



});



});







// ==========================
// ACCEPT REQUEST
// ==========================


async function acceptRequest(
requestID,
friendID
){


await addDoc(

collection(
db,
"friends"
),

{

user1:
auth.currentUser.uid,


user2:
friendID,


createdAt:
serverTimestamp()

}

);



await deleteDoc(

doc(
db,
"friendRequests",
requestID

)

);


}







// ==========================
// DECLINE REQUEST
// ==========================


async function declineRequest(id){


await deleteDoc(

doc(
db,
"friendRequests",
id

)

);


}