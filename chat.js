import { db, auth } from "./firebase.js";

import { openProfile } from "./profile.js";

import {
collection,
doc,
getDoc,
addDoc,
serverTimestamp,
query,
orderBy,
onSnapshot
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const messages =
document.getElementById("chatMessages");


const input =
document.getElementById("messageInput");


const send =
document.getElementById("sendMessage");



const chatQuery =
query(

collection(db,"messages"),

orderBy(
"createdAt"
)

);






onSnapshot(
chatQuery,
(snapshot)=>{


messages.innerHTML="";



snapshot.forEach(messageDoc=>{


const data =
messageDoc.data();



const div =
document.createElement("div");



div.className =
"chat-message";



div.innerHTML = `

<strong 
class="chat-user"
data-user="${data.senderID}"
>

${data.senderName}

</strong>

<br>

${data.text}

`;



const name =
div.querySelector(".chat-user");



name.onclick = ()=>{


openProfile(
name.dataset.user
);


};



messages.appendChild(div);



});



messages.scrollTop =
messages.scrollHeight;


});









send.onclick =
async()=>{


const text =
input.value.trim();



if(!text)
return;



const userSnap =
await getDoc(

doc(
db,
"users",
auth.currentUser.uid
)

);



const userData =
userSnap.data();





await addDoc(

collection(db,"messages"),

{

text:text,


senderID:
auth.currentUser.uid,


senderName:
userData.firstName,


profilePicture:
userData.profilePicture || "",


createdAt:
serverTimestamp()

}

);



input.value="";


};