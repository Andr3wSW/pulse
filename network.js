const canvas = document.getElementById("pulse-network");
const ctx = canvas.getContext("2d");

let width;
let height;


// ==========================
// Canvas Resize
// ==========================

function resizeCanvas(){

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();



// ==========================
// Nodes
// ==========================

const nodes = [];

const nodeCount = 45;



for(let i = 0; i < nodeCount; i++){

    nodes.push({

        x: Math.random() * width,
        y: Math.random() * height,

        radius: Math.random() * 2 + 1,

        vx:(Math.random() - .5) * .15,
        vy:(Math.random() - .5) * .15

    });

}



// ==========================
// Animation
// ==========================

function animate(){


    ctx.clearRect(
        0,
        0,
        width,
        height
    );



    // Move nodes

    nodes.forEach(node=>{


        node.x += node.vx;
        node.y += node.vy;



        // Wrap around screen

        if(node.x < 0)
            node.x = width;

        if(node.x > width)
            node.x = 0;


        if(node.y < 0)
            node.y = height;

        if(node.y > height)
            node.y = 0;


    });



    // ==========================
    // Connections
    // ==========================

    for(let i = 0; i < nodes.length; i++){

        for(let j = i + 1; j < nodes.length; j++){


            const a = nodes[i];
            const b = nodes[j];


            const distance =
            Math.hypot(
                a.x - b.x,
                a.y - b.y
            );


            const maxDistance = 180;



            if(distance < maxDistance){


                const opacity =
                1 - (distance / maxDistance);



                ctx.beginPath();


                ctx.moveTo(
                    a.x,
                    a.y
                );


                ctx.lineTo(
                    b.x,
                    b.y
                );


                ctx.strokeStyle =
                `rgba(34,197,94,${opacity * .25})`;


                ctx.lineWidth = 1;


                ctx.stroke();


            }


        }

    }



    // ==========================
    // Draw Nodes
    // ==========================


    nodes.forEach(node=>{


        ctx.beginPath();


        ctx.arc(
            node.x,
            node.y,
            node.radius,
            0,
            Math.PI * 2
        );


        ctx.fillStyle =
        "rgba(34,197,94,.8)";


        ctx.fill();


    });



    requestAnimationFrame(animate);

}


animate();

