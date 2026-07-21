const typing = document.getElementById("typing");
const newMessage = document.getElementById("newMessage");


setInterval(()=>{


    typing.style.display="block";


    setTimeout(()=>{


        typing.style.display="none";

        newMessage.classList.add("show");


    },2000);



    setTimeout(()=>{


        newMessage.classList.remove("show");


    },6000);



},8000);
