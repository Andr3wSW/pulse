import { db, auth } from "./firebase.js";

import {
    doc,
    getDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs,
    serverTimestamp
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const modal =
document.getElementById("profileModal");

const close =
document.getElementById("closeProfile");

const name =
document.getElementById("viewProfileName");

const username =
document.getElementById("viewProfileUsername");

const bio =
document.getElementById("viewProfileBio");

const picture =
document.getElementById("profilePicture");

const action =
document.getElementById("profileAction");

const reportButton =
document.getElementById("reportUser");

const reportForm =
document.getElementById("reportForm");

const reportReason =
document.getElementById("reportReason");

const reportDetails =
document.getElementById("reportDetails");

const cancelReport =
document.getElementById("cancelReport");

const submitReport =
document.getElementById("submitReport");


let viewedUID = null;


// ==========================
// OPEN PROFILE
// ==========================

export async function openProfile(uid){

    viewedUID = uid;

    const snap =
    await getDoc(
        doc(db,"users",uid)
    );


    if(!snap.exists())
        return;


    const user =
    snap.data();


    name.textContent =
    `${user.firstName} ${user.lastName || ""}`;


    username.textContent =
    "@" + user.username;


    bio.textContent =
    user.bio || "No bio yet";


    if(user.profilePicture){

        picture.innerHTML =
        `<img src="${user.profilePicture}">`;

    }

    else{

        picture.textContent =
        user.firstName[0];

    }


    // Reset report form

    reportForm.classList.add("hidden-page");

    reportReason.value = "";
    reportDetails.value = "";

    reportButton.style.display = "";


    await updateButton();


    modal.classList.remove(
        "hidden-page"
    );

}


// ==========================
// FRIEND BUTTON
// ==========================

async function updateButton(){

    const current =
    auth.currentUser;


    if(!current)
        return;


    // Viewing yourself

    if(current.uid === viewedUID){

        action.textContent =
        "Your Profile";

        action.disabled = true;

        reportButton.style.display = "none";

        return;

    }


    reportButton.style.display = "";


    // Check friendship

    const friendCheck =
    await getDocs(

        query(

            collection(db,"friends"),

            where(
                "user",
                "==",
                current.uid
            ),

            where(
                "friend",
                "==",
                viewedUID
            )

        )

    );


    if(!friendCheck.empty){

        action.textContent =
        "Friends";

        action.disabled = true;

        return;

    }


    // Check sent request

    const requestCheck =
    await getDocs(

        query(

            collection(db,"friendRequests"),

            where(
                "from",
                "==",
                current.uid
            ),

            where(
                "to",
                "==",
                viewedUID
            )

        )

    );


    if(!requestCheck.empty){

        action.textContent =
        "Request Sent";

        action.disabled = true;

        return;

    }


    action.textContent =
    "Add Friend";

    action.disabled = false;

}


// ==========================
// ADD FRIEND
// ==========================

action.onclick =
async()=>{

    const current =
    auth.currentUser;


    if(!current || !viewedUID)
        return;


    await addDoc(

        collection(db,"friendRequests"),

        {

            from:
            current.uid,

            to:
            viewedUID,

            createdAt:
            serverTimestamp()

        }

    );


    action.textContent =
    "Request Sent";

    action.disabled = true;

};


// ==========================
// OPEN REPORT FORM
// ==========================

reportButton.onclick =
()=>{

    if(!viewedUID)
        return;


    reportForm.classList.remove(
        "hidden-page"
    );

};


// ==========================
// CANCEL REPORT
// ==========================

cancelReport.onclick =
()=>{

    reportForm.classList.add(
        "hidden-page"
    );

    reportReason.value = "";
    reportDetails.value = "";

};


// ==========================
// SUBMIT REPORT
// ==========================

submitReport.onclick =
async()=>{

    const current =
    auth.currentUser;


    if(!current || !viewedUID)
        return;


    const reason =
    reportReason.value;


    const details =
    reportDetails.value.trim();


    if(!reason){

        alert(
            "Please select a reason."
        );

        return;

    }


    if(current.uid === viewedUID)
        return;


    submitReport.disabled = true;


    try{

        await addDoc(

            collection(db,"reports"),

            {

                reportedBy:
                current.uid,

                reportedUser:
                viewedUID,

                reason:
                reason,

                details:
                details,

                status:
                "open",

                createdAt:
                serverTimestamp()

            }

        );


        reportForm.classList.add(
            "hidden-page"
        );


        reportReason.value = "";
        reportDetails.value = "";


        alert(
            "Report submitted."
        );


    }

    catch(error){

        console.error(
            "Failed to submit report:",
            error
        );

        alert(
            "Unable to submit report."
        );

    }


    submitReport.disabled = false;

};


// ==========================
// CLOSE PROFILE
// ==========================

close.onclick =
()=>{

    modal.classList.add(
        "hidden-page"
    );

};