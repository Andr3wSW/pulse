import { db, auth } from "./firebase.js";

import {
doc,
getDoc,
addDoc,
collection,
query,
where,
getDocs
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



let viewedUID;



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
`
<img src="${user.profilePicture}">
`;

}

else{


picture.textContent =
user.firstName[0];

}




await updateButton();



modal.classList.remove(
"hidden-page"
);


}







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


return;

}




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
Date.now()

}

);



action.textContent =
"Request Sent";


action.disabled = true;


};






close.onclick =
()=>{


modal.classList.add(
"hidden-page"
);


};