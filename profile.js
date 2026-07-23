import { db, auth } from "./firebase.js";


import {

doc,
getDoc

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





export async function openProfile(uid){


const snap =
await getDoc(

doc(
db,
"users",
uid

)

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



modal.classList.remove(
"hidden-page"
);


}




close.onclick =
()=>{

modal.classList.add(
"hidden-page"
);

};