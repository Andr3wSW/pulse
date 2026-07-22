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

window.addEventListener("scroll",()=>{

    const scrollTop = window.scrollY;

    const docHeight =
        document.documentElement.scrollHeight
        - window.innerHeight;

    const percent =
        (scrollTop/docHeight)*100;

    document.getElementById("scrollProgress")
        .style.width = percent + "%";

});