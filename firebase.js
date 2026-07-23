import { initializeApp } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import { getAuth } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import { getFirestore } from 
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



const firebaseConfig = {

    const firebaseConfig = {
        apiKey: "AIzaSyAMc9c1Ez4bWWJvyUeqKdH1p7w8pu1qmOA",
        authDomain: "pulse-bb092.firebaseapp.com",
        projectId: "pulse-bb092",
        storageBucket: "pulse-bb092.firebasestorage.app",
        messagingSenderId: "90274642456",
        appId: "1:90274642456:web:f442f9fb191ad6e76fa16d"
    };

};



const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);

export const db = getFirestore(app);