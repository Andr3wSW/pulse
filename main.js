console.log("Pulse JS loaded");

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

// Smooth scrolling without changing URL

function scrollToSection(id){

    document
    .getElementById(id)
    .scrollIntoView({

        behavior:"smooth"

    });

}



// Scroll reveal animation

const observer = new IntersectionObserver((entries)=>{


    entries.forEach(entry=>{


        if(entry.isIntersecting){

            entry.target.classList.add("visible");

        }


    });


},{

    threshold:.15

});



document.querySelectorAll(".reveal")
.forEach(element=>{

    observer.observe(element);

});
