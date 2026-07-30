import { auth, db } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
addDoc,
doc,
getDoc,
onSnapshot,
orderBy,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



let currentUser = null;

let currentConversation = null;



const friendsContainer =
document.getElementById("messageFriends");


const messagesContainer =
document.getElementById("directMessages");


const input =
document.getElementById("directMessageInput");


const sendButton =
document.getElementById("sendDirectMessage");





auth.onAuthStateChanged(
async(user)=>{


if(!user)
return;


currentUser=user;


loadFriends();



});







// ==========================
// LOAD FRIENDS
// ==========================


async function loadFriends(){



const q =
query(

collection(db,"friends"),

where(
"user",
"==",
currentUser.uid
)

);



const snapshot =
await getDocs(q);



friendsContainer.innerHTML="";



for(const friendDoc of snapshot.docs){



const data =
friendDoc.data();



const userSnap =
await getDoc(

doc(
db,
"users",
data.friend
)

);



if(!userSnap.exists())
continue;



const person =
userSnap.data();



const button =
document.createElement("button");


button.textContent =
person.firstName;



button.onclick =
()=>openConversation(
data.friend
);



friendsContainer.appendChild(button);



}



}









// ==========================
// OPEN CONVERSATION
// ==========================


async function openConversation(friendID){



const conversationID =
[
currentUser.uid,
friendID
]
.sort()
.join("_");



currentConversation =
conversationID;




const conversationRef =
doc(
db,
"conversations",
conversationID
);




const conversation =
await getDoc(
conversationRef
);



if(!conversation.exists()){


await addDoc(

collection(db,"conversations"),

{

participants:[
currentUser.uid,
friendID
],

createdAt:
serverTimestamp()

}

);


}




loadMessages(
conversationID
);



}









// ==========================
// LOAD MESSAGES
// ==========================


function loadMessages(id){



const q =
query(

collection(
db,
"conversations",
id,
"messages"
),

orderBy(
"createdAt"
)

);



onSnapshot(
q,
(snapshot)=>{


messagesContainer.innerHTML="";



snapshot.forEach(message=>{


const data =
message.data();



const div =
document.createElement("div");


div.textContent =
data.text;



messagesContainer.appendChild(div);



});



}

);


}









// ==========================
// SEND MESSAGE
// ==========================


sendButton.onclick =
async()=>{


if(!input.value.trim())
return;


if(!currentConversation)
return;



await addDoc(

collection(

db,

"conversations",

currentConversation,

"messages"

),

{

senderID:
currentUser.uid,


text:
input.value.trim(),


createdAt:
serverTimestamp()

}

);



input.value="";



};