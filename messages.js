import { auth, db } from "./firebase.js";

import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    doc,
    getDoc,
    setDoc,
    onSnapshot,
    orderBy,
    serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



let currentUser = null;

let currentConversation = null;

let unsubscribeMessages = null;



const conversationList =
document.getElementById("conversationList");


const dmHeader =
document.getElementById("dmHeader");


const dmMessages =
document.getElementById("dmMessages");


const dmInput =
document.getElementById("dmInput");


const dmSend =
document.getElementById("dmSend");





auth.onAuthStateChanged(async(user)=>{


    if(!user)
    return;


    currentUser = user;


    loadConversations();


});





// =================================
// LOAD CONVERSATIONS
// =================================


function loadConversations(){


    const q =
    query(

        collection(db,"conversations"),

        where(
            "participants",
            "array-contains",
            currentUser.uid
        )

    );



    onSnapshot(
    q,
    async(snapshot)=>{


        conversationList.innerHTML="";



        for(const conversation of snapshot.docs){


            const data =
            conversation.data();



            const otherID =
            data.participants.find(
                id => id !== currentUser.uid
            );



            if(!otherID)
            continue;



            const userSnap =
            await getDoc(

                doc(
                    db,
                    "users",
                    otherID
                )

            );



            if(!userSnap.exists())
            continue;



            const person =
            userSnap.data();



            const button =
            document.createElement("div");



            button.className =
            "conversation-item";



            button.innerHTML = `

                <div class="friend-avatar">

                    ${
                    person.profilePicture

                    ?

                    `<img src="${person.profilePicture}">`

                    :

                    person.firstName
                    .charAt(0)
                    .toUpperCase()

                    }

                </div>


                <div>

                    <h3>
                    ${person.firstName}
                    </h3>


                    <p>
                    ${data.lastMessage || "Start chatting"}
                    </p>

                </div>

            `;



            button.onclick =
            ()=>{

                openConversation(
                    conversation.id,
                    otherID,
                    person
                );

            };



            conversationList.appendChild(button);


        }


    });


}







// =================================
// OPEN CONVERSATION
// =================================


async function openConversation(
conversationID,
friendID,
person
){



    currentConversation =
    conversationID;



    dmHeader.innerHTML = `

        <div class="friend-avatar">

            ${
            person.profilePicture

            ?

            `<img src="${person.profilePicture}">`

            :

            person.firstName
            .charAt(0)
            .toUpperCase()

            }

        </div>


        <span>
        ${person.firstName}
        </span>

    `;



    loadMessages(
        conversationID
    );


}









// =================================
// CREATE OR FIND CONVERSATION
// =================================


async function getConversation(friendID){



    const id =
    [

        currentUser.uid,

        friendID

    ]
    .sort()
    .join("_");



    const conversationRef =
    doc(
        db,
        "conversations",
        id
    );



    const snap =
    await getDoc(
        conversationRef
    );



    if(!snap.exists()){


        await setDoc(

            conversationRef,

            {

                participants:[

                    currentUser.uid,

                    friendID

                ],

                lastMessage:"",

                updatedAt:
                serverTimestamp()

            }

        );


    }



    return id;


}







// =================================
// LOAD MESSAGES
// =================================


function loadMessages(id){



    if(unsubscribeMessages)
    {
        unsubscribeMessages();
    }



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



    unsubscribeMessages =

    onSnapshot(

    q,

    (snapshot)=>{


        dmMessages.innerHTML="";



        snapshot.forEach(message=>{


            const data =
            message.data();



            const div =
            document.createElement("div");



            div.className =
            data.senderID === currentUser.uid

            ?

            "dm-message mine"

            :

            "dm-message";



            div.textContent =
            data.text;



            dmMessages.appendChild(div);



        });



        dmMessages.scrollTop =
        dmMessages.scrollHeight;



    });


}








// =================================
// SEND MESSAGE
// =================================


dmSend.onclick =
async()=>{


    const text =
    dmInput.value.trim();



    if(!text)
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


            text:text,


            createdAt:
            serverTimestamp()

        }

    );



    await setDoc(

        doc(
            db,
            "conversations",
            currentConversation
        ),

        {

            lastMessage:text,

            updatedAt:
            serverTimestamp()

        },

        {

            merge:true

        }

    );



    dmInput.value="";


};





// =================================
// OPEN FROM FRIEND BUTTON
// =================================


window.openMessage =
async function(friendID){


    const userSnap =
    await getDoc(

        doc(
            db,
            "users",
            friendID
        )

    );



    if(!userSnap.exists())
    return;



    const person =
    userSnap.data();



    const conversationID =
    await getConversation(
        friendID
    );



    openConversation(
        conversationID,
        friendID,
        person
    );


};