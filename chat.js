import { auth, db } from "./firebase.js";

import { openProfile } from "./profile.js";

import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    onSnapshot,
    getDoc,
    doc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";





const messagesContainer =
document.getElementById("chatMessages");


const messageInput =
document.getElementById("messageInput");


const sendButton =
document.getElementById("sendMessage");



let currentUser = null;





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

            uid:
            currentUser.uid,


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
    async(snapshot)=>{


        messagesContainer.innerHTML="";



        for(const messageDoc of snapshot.docs){



            const message =
            messageDoc.data();

            if(!message.uid)
            continue;




            const userSnap =
            await getDoc(

                doc(
                    db,
                    "users",
                    message.uid
                )

            );



            if(!userSnap.exists())
            continue;



            const user =
            userSnap.data();




            const displayName =
            user.firstName;



            const messageDiv =
            document.createElement("div");



            messageDiv.className =
            "chat-message";




            messageDiv.innerHTML = `

            <span 
            class="chat-user"
            data-uid="${message.uid}">
            
            ${displayName}

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
                    message.uid
                );


            };



            messagesContainer.appendChild(
                messageDiv
            );



        }



        messagesContainer.scrollTop =
        messagesContainer.scrollHeight;



    });


}