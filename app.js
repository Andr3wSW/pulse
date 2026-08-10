import { checkAuth } from "./auth.js";

import { db } from "./firebase.js";

import {
    doc,
    getDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ==========================
// AUTH / PROFILE
// ==========================

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


    if(!userSnap.exists())
        return;


    const data =
    userSnap.data();


    // ==========================
    // PROFILE HEADER
    // ==========================

    const displayName =
    data.firstName +
    (
        data.lastName
        ?
        " " + data.lastName
        :
        ""
    );


    const profileName =
    document.getElementById(
        "profileName"
    );


    if(profileName){

        profileName.textContent =
        displayName;

    }


    const profileCircle =
    document.getElementById(
        "profileInitial"
    );


    if(profileCircle){

        if(data.profilePicture){

            profileCircle.innerHTML = `
                <img
                    src="${data.profilePicture}"
                    class="profile-avatar-image"
                >
            `;

        }

        else{

            profileCircle.textContent =
            data.firstName
            .charAt(0)
            .toUpperCase();

        }

    }


    // ==========================
    // MODERATION ACCESS
    // ==========================

    const role =
    data.role || "user";


    const moderationOption =
    document.getElementById(
        "moderationOption"
    );


    if(
        moderationOption &&
        (
            role === "owner" ||
            role === "admin" ||
            role === "moderator"
        )
    ){

        moderationOption.classList.remove(
            "hidden-page"
        );

    }

});


// ==========================
// APP NAVIGATION
// ==========================

const buttons =
document.querySelectorAll(
    ".app-option"
);


const pages = {

    global:
    document.getElementById(
        "global-page"
    ),

    friends:
    document.getElementById(
        "friends-page"
    ),

    messages:
    document.getElementById(
        "messages-page"
    ),

    moderation:
    document.getElementById(
        "moderation-page"
    )

};


buttons.forEach(button=>{

    button.addEventListener(
        "click",
        ()=>{

            const selected =
            button.dataset.page;


            // Remove active state

            buttons.forEach(btn=>{

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            // Hide every page

            Object.values(pages)
            .forEach(page=>{

                if(page){

                    page.classList.add(
                        "hidden-page"
                    );

                }

            });


            // Show selected page

            if(pages[selected]){

                pages[selected]
                .classList.remove(
                    "hidden-page"
                );

            }

        }
    );

});