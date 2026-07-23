import { db } from "./firebase.js";

import { checkAuth } from "./auth.js";

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



checkAuth()
.then((user)=>{


// ==========================
// Elements
// ==========================


const searchInput =
document.getElementById("friendSearch");


const results =
document.getElementById("searchResults");


const requests =
document.getElementById("incomingRequests");


const friendsList =
document.getElementById("friendsList");





// ==========================
// Search Users
// ==========================


let searchTimeout;



searchInput.addEventListener(
"input",
()=>{


clearTimeout(searchTimeout);



searchTimeout =
setTimeout(()=>{

searchUsers();

},300);



});





async function searchUsers(){


const search =
searchInput.value
.trim()
.toLowerCase();



results.innerHTML="";



if(search.length < 2)
return;



try{


const snapshot =
await getDocs(
collection(db,"users")
);



let found = false;



snapshot.forEach((userDoc)=>{


const data =
userDoc.data();


const uid =
userDoc.id;



if(uid === user.uid)
return;



const terms =
data.searchTerms || [];



const matches =
terms.some(term =>
term.includes(search)
);



if(!matches)
return;



found = true;



const card =
document.createElement("div");


card.className =
"friend-result";



card.innerHTML = `

<div>

<strong>
${data.firstName}
${data.lastName || ""}
</strong>

<br>

<span>
@${data.username}
</span>


</div>


<button class="primary">

Add

</button>

`;



card.querySelector("button")
.onclick =
()=>sendRequest(uid, card.querySelector("button"));



results.appendChild(card);



});



if(!found){

results.innerHTML =
"<p>No users found</p>";

}


}

catch(error){

console.error(
"Search failed:",
error
);

}


}




snapshot.forEach((userDoc)=>{


const data =
userDoc.data();


const uid =
userDoc.id;



// Don't show yourself

if(uid === user.uid)
return;



const card =
document.createElement("div");


card.className =
"friend-result";



card.innerHTML = `

<div>

<strong>
${data.firstName}
${data.lastName || ""}
</strong>

<br>

<span>
@${data.username}
</span>


</div>


<button class="primary">

Add

</button>

`;



const button =
card.querySelector("button");



button.onclick =
()=>sendRequest(uid,button);



results.appendChild(card);



});


}

catch(error){

console.error(
"Search error:",
error
);

}


}









// ==========================
// Send Friend Request
// ==========================


async function sendRequest(
receiver,
button
){


button.disabled=true;


try{


// Check if request already exists

const sentQuery =
query(

collection(
db,
"friendRequests"
),

where(
"from",
"==",
user.uid
),

where(
"to",
"==",
receiver

)

);



const existing =
await getDocs(sentQuery);



if(!existing.empty){

button.textContent =
"Pending";

return;

}





await addDoc(

collection(
db,
"friendRequests"
),

{

from:
user.uid,


to:
receiver,


status:
"pending",


createdAt:
serverTimestamp()

}

);



button.textContent =
"Pending";



}

catch(error){

console.error(
"Request error:",
error
);

button.disabled=false;

}



}









// ==========================
// Incoming Requests
// ==========================


const requestQuery =
query(

collection(db,"friendRequests"),

where(
"to",
"==",
user.uid
),

where(
"status",
"==",
"pending"
)

);



onSnapshot(
requestQuery,
(snapshot)=>{


requests.innerHTML="";



if(snapshot.empty){

requests.innerHTML =
"<p>No requests</p>";

return;

}



snapshot.forEach(async(requestDoc)=>{


const request =
requestDoc.data();



const sender =
await getDoc(

doc(
db,
"users",
request.from

)

);



const senderData =
sender.data();




const card =
document.createElement("div");


card.className =
"friend-result";



card.innerHTML = `

<div>

<strong>
${senderData.firstName}
${senderData.lastName || ""}
</strong>


<br>


@${senderData.username}


</div>



<button class="primary accept">

Accept

</button>



<button class="secondary decline">

Decline

</button>

`;




card.querySelector(".accept")
.onclick =
()=>acceptRequest(
requestDoc.id,
request.from
);



card.querySelector(".decline")
.onclick =
()=>declineRequest(
requestDoc.id
);



requests.appendChild(card);



});


});









// ==========================
// Accept Request
// ==========================


async function acceptRequest(
requestID,
friendID
){


await addDoc(

collection(db,"friends"),

{

user1:
user.uid,


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
// Decline Request
// ==========================


async function declineRequest(
requestID
){


await deleteDoc(

doc(
db,
"friendRequests",
requestID

)

);



}









// ==========================
// Friends List
// ==========================


const friendsQuery =
query(

collection(db,"friends"),

where(
"user1",
"==",
user.uid
)

);



onSnapshot(
friendsQuery,
async(snapshot)=>{


friendsList.innerHTML="";



if(snapshot.empty){

friendsList.innerHTML =
"<p>No friends yet</p>";

return;

}



snapshot.forEach(async(friendDoc)=>{


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



const friendData =
friend.data();



const card =
document.createElement("div");


card.className =
"friend-result";


card.innerHTML = `

<div>

<strong>
${friendData.firstName}
${friendData.lastName || ""}
</strong>


<br>


@${friendData.username}

</div>

`;



friendsList.appendChild(card);



});


});



});