import { checkAuth } from "./auth.js";

import { db } from "./firebase.js";

import {
doc,
getDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";




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



if(userSnap.exists()){


const data =
userSnap.data();



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
.getElementById("profileName")
.textContent =
displayName;



document
.getElementById("profileInitial")
.textContent =
data.firstName
.charAt(0)
.toUpperCase();



}



});

// ==========================
// App Navigation
// ==========================

const buttons =
document.querySelectorAll(".app-option");


const pages = {

    global:
    document.getElementById("global-page"),

    friends:
    document.getElementById("friends-page"),

    messages:
    document.getElementById("messages-page")

};



buttons.forEach(button=>{


    button.addEventListener("click",()=>{


        const selected =
        button.dataset.page;



        // remove active

        buttons.forEach(btn=>{

            btn.classList.remove("active");

        });



        button.classList.add("active");



        // hide everything

        Object.values(pages).forEach(page=>{

            if(page)
            page.classList.add("hidden-page");

        });



        // show selected

        if(pages[selected]){

            pages[selected]
            .classList.remove("hidden-page");

        }


    });


});