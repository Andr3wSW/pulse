import { checkAuth } from "./auth.js";

import ImageKit from "https://esm.sh/imagekit-javascript";

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


        if(!file){

            console.log("No file selected");
            return;

        }


        console.log("Selected file:", file);



                try{


                    const authResponse =
                    await fetch(
                        "https://pulse-imagekit-auth.scottwebster-andrew.workers.dev/"
                    );


                    const authData =
                    await authResponse.json();



                    const formData =
                    new FormData();



                    formData.append(
                        "file",
                        file
                    );


                    formData.append(
                        "fileName",
                        file.name
                    );


                    formData.append(
                        "publicKey",
                        "public_6HFXPb7Zif5moejaEPKkz+w7ItE="
                    );


                    formData.append(
                        "signature",
                        authData.signature
                    );


                    formData.append(
                        "expire",
                        authData.expire
                    );


                    formData.append(
                        "token",
                        authData.token
                    );



                    console.log("Uploading to ImageKit...");



                    const uploadResponse =
                    await fetch(
                        "https://upload.imagekit.io/api/v1/files/upload",
                        {
                            method:"POST",
                            body:formData
                        }
                    );



                    const result =
                    await uploadResponse.json();



                    console.log(
                        "ImageKit response:",
                        result
                    );



                    const url =
                    result.url;


            await updateDoc(
                userRef,
                {
                    profilePicture:url
                }
            );


            console.log("Firestore updated");



            document
            .getElementById("profileImage")
            .src =
            url;



            alert("Profile picture updated");


        }

        catch(error){

            console.error(
                "Profile upload failed:",
                error
            );

            alert(error.message);

        }


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