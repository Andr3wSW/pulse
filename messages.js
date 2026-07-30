import { auth, db } from "./firebase.js";

import {
collection,
query,
where,
getDocs,
doc,
getDoc,
setDoc,
onSnapshot,
addDoc,
orderBy,
serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



let currentUser = null;

let currentConversation = null;



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



    conversationList.innerHTML="";



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


        button.className =
        "conversation-button";


        button.textContent =
        person.firstName;



        button.onclick =
        ()=>{

            openConversation(
                data.friend,
                person.firstName
            );

        };



        conversationList.appendChild(button);


    }


}






// ==========================
// OPEN CONVERSATION
// ==========================


async function openConversation(
friendID,
friendName
){


    const conversationID =
    [
        currentUser.uid,
        friendID
    ]
    .sort()
    .join("_");



    currentConversation =
    conversationID;



    dmHeader.textContent =
    friendName;




    await setDoc(

        doc(
            db,
            "conversations",
            conversationID
        ),

        {

            participants:[
                currentUser.uid,
                friendID
            ],

            updatedAt:
            serverTimestamp()

        },

        {
            merge:true
        }

    );



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


            dmMessages.innerHTML="";



            snapshot.forEach(message=>{


                const data =
                message.data();



                const div =
                document.createElement("div");



                div.className =
                "dm-message";



                div.textContent =
                data.text;



                dmMessages.appendChild(div);


            });



            dmMessages.scrollTop =
            dmMessages.scrollHeight;


        }

    );


}







// ==========================
// SEND MESSAGE
// ==========================


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



    dmInput.value="";


};