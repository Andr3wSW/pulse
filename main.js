console.log("Pulse JS loaded");


// Smooth scrolling

window.scrollToSection = function(id){

    const section = document.getElementById(id);

    if(section){

        section.scrollIntoView({
            behavior:"smooth"
        });

    }

};



// Scroll reveal

const revealElements = document.querySelectorAll(".reveal");


const observer = new IntersectionObserver(
(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("visible");

        }

    });

},
{
    threshold:0.15
});


revealElements.forEach(element=>{

    observer.observe(element);

});
