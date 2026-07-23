import { auth } from "./firebase.js";

import {
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";



export function checkAuth(){


return new Promise((resolve)=>{


onAuthStateChanged(
auth,
(user)=>{


if(user){

resolve(user);

}
else{

window.location.href="login";

}


});


});


}