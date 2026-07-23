import {
signOut
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";


document
.getElementById("logout")
.onclick = async()=>{

await signOut(auth);

window.location.href="login";

};

import { checkAuth } from "./auth.js";

import {
storage,
db
}
from "./firebase.js";


import {
ref,
uploadBytes,
getDownloadURL
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-storage.js";


import {
doc,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";




const upload =
document.getElementById("imageUpload");



checkAuth()
.then((user)=>{


upload.addEventListener(
"change",
async()=>{


const file =
upload.files[0];


if(!file)
return;



// Create storage location

const imageRef =
ref(
storage,
"profilePictures/" + user.uid
);



// Upload image

await uploadBytes(
imageRef,
file
);



// Get URL

const url =
await getDownloadURL(imageRef);



// Save URL

await updateDoc(

doc(
db,
"users",
user.uid
),

{

profilePicture:url

}

);



document
.getElementById("profileImage")
.src=url;



});


});