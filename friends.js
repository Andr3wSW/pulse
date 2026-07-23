import { auth, db } from "./firebase.js";

import {
collection,
getDocs,
addDoc,
serverTimestamp,
query,
where,
onSnapshot,
doc,
getDoc,
deleteDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



let currentUser;



auth.onAuthStateChanged((user)=>{


if(!user)
return;


currentUser = user;


loadRequests();

loadFriends();


});




// ==========================
// ELEMENTS
// ==========================


const searchInput =
document.getElementById("friendSearch");


const searchResults =
document.getElementById("searchResults");


const incomingRequests =
document.getElementById("incomingRequests");


const friendsList =
document.getElementById("friendsList");




// ==========================
// SEARCH
// ==========================


searchInput.addEventListener(
"input",
async()=>{


const text =
searchInput.value
.toLowerCase()
.trim();



searchResults.innerHTML="";



if(text.length < 2)
return;



const users =
await getDocs(
collection(db,"users")
);



users.forEach(userDoc=>{


const data =
userDoc.data();


const uid =
userDoc.id;



if(uid === currentUser.uid)
return;



const terms =
data.searchTerms || [];



const match =
terms.some(term =>
term.includes(text)
);



if(!match)
return;



const div =
document.createElement("div");


div.className =
"friend-result";



div.innerHTML = `

<div>

<strong>
${data.firstName}
${data.lastName || ""}
</strong>

<br>

@${data.username}

</div>


<button class="primary">
Add Friend
</button>

`;



div.querySelector("button")
.onclick =
()=>sendRequest(uid);



searchResults.appendChild(div);



});


});







// ==========================
// SEND REQUEST
// ==========================


async function sendRequest(uid){


const existing =
await getDocs(

query(

collection(db,"friendRequests"),

where(
"from",
"==",
currentUser.uid
),

where(
"to",
"==",
uid
)

)

);



if(!existing.empty){

alert("Request already sent");

return;

}



await addDoc(

collection(db,"friendRequests"),

{

from:
currentUser.uid,

to:
uid,

status:
"pending",

createdAt:
serverTimestamp()

}

);



alert("Friend request sent");


}








// ==========================
// REQUESTS
// ==========================


function loadRequests(){


const q =
query(

collection(db,"friendRequests"),

where(
"to",
"==",
currentUser.uid
),

where(
"status",
"==",
"pending"
)

);



onSnapshot(q, async(snapshot)=>{


incomingRequests.innerHTML="";



for(const requestDoc of snapshot.docs){


const request =
requestDoc.data();



const userSnap =
await getDoc(

doc(
db,
"users",
request.from
)

);



const user =
userSnap.data();



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


<button class="primary">
Accept
</button>


<button class="secondary">
Decline
</button>

`;



div.children[1].onclick =
()=>acceptRequest(
requestDoc.id,
request.from
);



div.children[2].onclick =
()=>declineRequest(
requestDoc.id
);



incomingRequests.appendChild(div);



}


});


}








async function acceptRequest(
requestID,
friendID
){


await addDoc(

collection(db,"friends"),

{

user1:
currentUser.uid,

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







async function declineRequest(id){


await deleteDoc(

doc(
db,
"friendRequests",
id

)

);


}









// ==========================
// FRIEND LIST
// ==========================


function loadFriends(){


const q =
query(

collection(db,"friends"),

where(
"user1",
"==",
currentUser.uid
)

);



onSnapshot(q, async(snapshot)=>{


friendsList.innerHTML="";



for(const friendDoc of snapshot.docs){


const data =
friendDoc.data();



const friend =
await getDoc(

doc(
db,
"users",
data.user2

)

);



const user =
friend.data();



const div =
document.createElement("div");


div.className =
"friend-result";



div.innerHTML = `

<strong>
${user.firstName}
${user.lastName || ""}
</strong>

<br>

@${user.username}

`;



friendsList.appendChild(div);



}


});


}