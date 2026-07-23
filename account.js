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