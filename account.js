import { checkAuth } from "./auth.js";

import {
    db,
    storage,
    auth
}
from "./firebase.js";


import {
    doc,
    getDoc,
    updateDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


import {
    ref,
    uploadBytes,
    getDownloadURL
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";


import {
    signOut
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";





checkAuth()

.then(async(user)=>{


    const userRef =
    doc(
        db,
        "users",
        user.uid
    );


    const userSnap =
    await getDoc(userRef);



    if(!userSnap.exists()){

        console.error("User document does not exist");

        return;

    }



    const data =
    userSnap.data();



    // Display name

    const displayName =
    data.firstName +
    (
        data.lastName
        ?
        " " + data.lastName
        :
        ""
    );



    document
    .getElementById("displayName")
    .textContent =
    displayName;



    document
    .getElementById("username")
    .textContent =
    "@" + data.username;



    document
    .getElementById("email")
    .textContent =
    data.email;



    // Bio

    document
    .getElementById("bioInput")
    .value =
    data.bio || "";



    // Created date

    if(data.createdAt){


        const date =
        new Date(data.createdAt);



        document
        .getElementById("createdAt")
        .textContent =
        date.toLocaleDateString();


    }



    // Profile picture

    if(data.profilePicture){


        document
        .getElementById("profileImage")
        .src =
        data.profilePicture;


    }



    // ==========================
    // Profile Upload
    // ==========================


    document
    .getElementById("imageUpload")
    .addEventListener(
    "change",
    async()=>{


        const file =
        document
        .getElementById("imageUpload")
        .files[0];


        if(!file)
        return;



        const imageRef =
        ref(
            storage,
            "profilePictures/" + user.uid
        );



        await uploadBytes(
            imageRef,
            file
        );



        const url =
        await getDownloadURL(imageRef);



        await updateDoc(
            userRef,
            {

                profilePicture:url

            }
        );



        document
        .getElementById("profileImage")
        .src =
        url;



    });



    // ==========================
    // Save Bio
    // ==========================


    document
    .getElementById("saveBio")
    .onclick =
    async()=>{


        const bio =
        document
        .getElementById("bioInput")
        .value
        .trim();



        await updateDoc(
            userRef,
            {

                bio:bio

            }
        );


        alert("Bio saved");


    };





});




// ==========================
// Logout
// ==========================


document
.getElementById("logout")
.onclick =
async()=>{


    await signOut(auth);


    window.location.href="login";


};