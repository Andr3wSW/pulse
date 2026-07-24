import { auth, db } from "./firebase.js";

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


    currentUser = user;


    loadRequests();

    loadFriends();


});





// ======================
// SEARCH USERS
// ======================


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



    searchResults.innerHTML="";



    if(text.length < 2)
    return;




    const snapshot =
    await getDocs(
        collection(db,"users")
    );



    snapshot.forEach((userDoc)=>{


        const data =
        userDoc.data();


        const uid =
        userDoc.id;



        if(uid === currentUser.uid)
        return;



        const terms =
        data.searchTerms || [];



        const found =
        terms.some(
            term =>
            term.includes(text)
        );



        if(!found)
        return;



        createSearchCard(
            uid,
            data
        );


    });



}






function createSearchCard(uid,data){


    const card =
    document.createElement("div");


    card.className =
    "friend-card clickable";



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


    <button class="primary">
    Add
    </button>

    `;



    card.onclick = ()=>{


        if(window.openProfile){

            window.openProfile(uid);

        }


    };



    card.querySelector("button")
    .onclick =
    async(e)=>{


        e.stopPropagation();


        await sendRequest(uid);


    };



    searchResults.appendChild(card);


}









// ======================
// SEND REQUEST
// ======================


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
            friendID,


            createdAt:
            serverTimestamp()

        }

    );



    alert("Friend request sent");


}









// ======================
// INCOMING REQUESTS
// ======================


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



            const userSnap =
            await getDoc(

                doc(
                    db,
                    "users",
                    data.from
                )

            );



            if(!userSnap.exists())
            continue;



            const person =
            userSnap.data();



            const card =
            document.createElement("div");


            card.className =
            "friend-card";



            card.innerHTML = `


            <div class="friend-info">

                <h3>
                ${person.firstName}
                ${person.lastName || ""}
                </h3>

                <p>
                @${person.username}
                </p>

            </div>


            <div>

            <button class="primary accept">
            Accept
            </button>


            <button class="secondary decline">
            Decline
            </button>


            </div>


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









// ======================
// FRIEND LIST
// ======================


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



        if(snapshot.empty){


            friendsList.innerHTML =
            "<p>No friends yet</p>";


            return;


        }





        for(const friend of snapshot.docs){



            const data =
            friend.data();



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




            const card =
            document.createElement("div");


            card.className =
            "friend-card clickable";



            card.innerHTML = `

            <div class="friend-info">

            <h3>
            ${person.firstName}
            ${person.lastName || ""}
            </h3>

            <p>
            @${person.username}
            </p>

            </div>

            `;



            card.onclick = ()=>{


                if(window.openProfile){

                    window.openProfile(
                    data.friend
                    );

                }


            };



            friendsList.appendChild(card);



        }


    });


}