import { db, auth } from "./firebase.js";

import {
collection,
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



snapshot.forEach(doc=>{


const data =
doc.data();



const div =
document.createElement("div");



div.className =
"chat-message";



div.innerHTML = `

<strong>
${data.senderName}
</strong>

<br>

${data.text}

`;



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



await addDoc(

collection(db,"messages"),

{

text:text,

senderID:auth.currentUser.uid,

senderName:auth.currentUser.email,

createdAt:serverTimestamp()

}

);



input.value="";


};