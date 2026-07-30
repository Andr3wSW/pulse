import { auth, db } from "./firebase.js";

import { openProfile } from "./profile.js";

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



let currentUser = null;



const searchInput =
document.getElementById("friendSearch");

const searchResults =
document.getElementById("searchResults");

const incomingRequests =
document.getElementById("incomingRequests");

const friendsList =
document.getElementById("friendsList");





auth.onAuthStateChanged((user)=>{

    if(!user)
    return;


    console.log(
        "Logged in:",
        user.uid
    );


    currentUser = user;


    loadRequests();

    loadFriends();


});






// ==========================
// SEARCH
// ==========================


if(searchInput){


searchInput.addEventListener(
"input",
()=>{

    searchUsers();

});


}






async function searchUsers(){


    if(!currentUser)
    return;



    const text =
    searchInput.value
    .trim()
    .toLowerCase();



    console.log(
        "Searching:",
        text
    );



    searchResults.innerHTML="";



    if(text.length < 2)
    return;




    const addedUsers =
    new Set();



    const snapshot =
    await getDocs(
        collection(db,"users")
    );



    snapshot.forEach((userDoc)=>{


        const uid =
        userDoc.id;



        const data =
        userDoc.data();



        console.log(
            "Checking user:",
            uid,
            data.firstName
        );



        if(uid === currentUser.uid)
        return;



        if(addedUsers.has(uid))
        {

            console.log(
                "Duplicate blocked:",
                uid
            );

            return;

        }




        const terms =
        data.searchTerms || [];



        const matches =
        terms.some(
            term =>
            term
            .toLowerCase()
            .includes(text)
        );



        if(!matches)
        return;




        addedUsers.add(uid);



        console.log(
            "Creating card:",
            uid,
            data.firstName
        );



        createSearchCard(
            uid,
            data
        );



    });



}








function createSearchCard(
uid,
data
){



    const card =
    document.createElement("div");


    card.className =
    "friend-card clickable";

    card.onclick = ()=>{

        openProfile(data.friend);

    };



    card.innerHTML = `

    <div class="friend-info">

        <h3>
        ${data.firstName}
        ${data.lastName || ""}
        </h3>


        <p>
        @${data.username}
        </p>


    </div>


    <button class="primary add-button">

    Add

    </button>


    `;



    card.onclick = ()=>{


        console.log(
            "Opening profile:",
            uid
        );


        if(window.openProfile)
        {

            window.openProfile(uid);

        }


    };





    card.querySelector(".add-button")
    .onclick =
    async(e)=>{


        e.stopPropagation();


        console.log(
            "Sending request:",
            uid
        );


        await sendRequest(uid);


    };



    searchResults.appendChild(card);



}









// ==========================
// SEND REQUEST
// ==========================


async function sendRequest(friendID){



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
                friendID
            )

        )

    );



    if(!existing.empty)
    {

        console.log(
            "Request already exists"
        );

        return;

    }




    await addDoc(

        collection(db,"friendRequests"),

        {

            from:
            currentUser.uid,


            to:
            friendID,


            createdAt:
            serverTimestamp()

        }

    );



    console.log(
        "Request sent successfully"
    );



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
)

);



onSnapshot(
q,
async(snapshot)=>{


if(!incomingRequests)
return;



incomingRequests.innerHTML="";



for(const request of snapshot.docs){


const data =
request.data();



const user =
await getDoc(

doc(
db,
"users",
data.from
)

);



if(!user.exists())
continue;



const person =
user.data();



const card =
document.createElement("div");



card.className =
"friend-card";



card.innerHTML = `

<div class="friend-avatar">

${
person.profilePicture

?

`<img src="${person.profilePicture}">`

:

person.firstName[0]

}

</div>


<div class="friend-info">

<h3>
${person.firstName}
</h3>

<p>
@${person.username}
</p>

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
request.id,
data.from
);



card.querySelector(".decline")
.onclick =
()=>declineRequest(
request.id
);



incomingRequests.appendChild(card);



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

user:
currentUser.uid,

friend:
friendID,

createdAt:
serverTimestamp()

}

);




await addDoc(

collection(db,"friends"),

{

user:
friendID,

friend:
currentUser.uid,

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
"user",
"==",
currentUser.uid
)

);



onSnapshot(
q,
async(snapshot)=>{



if(!friendsList)
return;



friendsList.innerHTML="";



if(snapshot.empty)
{

friendsList.innerHTML =

<div class="empty-state">

    <div class="empty-icon">

        👋

    </div>

    <h3>

        No friends yet

    </h3>

    <p>

        Search for people above and send your first friend request.

    </p>

</div>

`;

return;

}



for (const friendDoc of snapshot.docs) {

    const data = friendDoc.data();

    const user = await getDoc(
        doc(db, "users", data.friend)
    );

    if (!user.exists()) continue;

    const person = user.data();

    const card = document.createElement("div");

    card.className = "friend-card clickable";

    card.onclick = () => {
        openProfile(data.friend);
    };

    card.innerHTML = `

        <div class="friend-avatar">

            ${
                person.profilePicture
                ? `<img src="${person.profilePicture}">`
                : person.firstName.charAt(0).toUpperCase()
            }

        </div>

        <div class="friend-info">

            <h3>
                ${person.firstName} ${person.lastName || ""}
            </h3>

            <p>
                @${person.username}
            </p>

        </div>

        <button class="secondary message-button">
            Message
        </button>

    `;

    card.querySelector(".message-button").onclick = (e) => {
        e.stopPropagation();

        // I'll hook this up to DMs later Sebastian.
        console.log("Open DM with", data.friend);
    };

    friendsList.appendChild(card);

}



});


}