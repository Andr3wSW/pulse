import { auth, db } from "./firebase.js";

import { openProfile } from "./profile.js";

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



let currentUser = null;



const messagesContainer =
document.getElementById("chatMessages");


const messageInput =
document.getElementById("messageInput");


const sendButton =
document.getElementById("sendMessage");





auth.onAuthStateChanged((user)=>{


    if(!user)
    return;


    currentUser = user;


    loadMessages();


});








// ==========================
// SEND MESSAGE
// ==========================


sendButton.onclick =
sendMessage;



messageInput.addEventListener(
"keydown",
(e)=>{


    if(e.key === "Enter"){

        sendMessage();

    }


});






async function sendMessage(){


    const text =
    messageInput.value.trim();



    if(!text)
    return;



    await addDoc(

        collection(db,"messages"),

        {

            senderID:
            currentUser.uid,


            senderName:
            currentUser.displayName || "User",


            profilePicture:
            "",


            text:text,


            createdAt:
            serverTimestamp()

        }

    );



    messageInput.value = "";


}









// ==========================
// LOAD MESSAGES
// ==========================


function loadMessages(){



    const q =
    query(

        collection(db,"messages"),

        orderBy(
            "createdAt",
            "asc"
        )

    );



    onSnapshot(
    q,
    (snapshot)=>{


        messagesContainer.innerHTML="";



        snapshot.forEach((messageDoc)=>{


            const message =
            messageDoc.data();



            const messageDiv =
            document.createElement("div");



            messageDiv.className =
            "chat-message";



            messageDiv.innerHTML = `

            <span 
            class="chat-user"
            data-uid="${message.senderID}">

            ${message.senderName}

            </span>


            <span class="chat-text">

            ${message.text}

            </span>

            `;



            messageDiv
            .querySelector(".chat-user")
            .onclick =
            ()=>{


                openProfile(
                    message.senderID
                );


            };



            messagesContainer.appendChild(
                messageDiv
            );



        });



        messagesContainer.scrollTop =
        messagesContainer.scrollHeight;



    });


}