const canvas = document.getElementById("pulse-network");
const ctx = canvas.getContext("2d");


let width;
let height;


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

const pulses = [];

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



    nodes.forEach(node=>{


// ==========================
// Connections
// ==========================


for(let i = 0; i < nodes.length; i++){

    for(let j = i + 1; j < nodes.length; j++){


        const a = nodes[i];
        const b = nodes[j];


        const distance = Math.hypot(
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


        node.x += node.vx;
        node.y += node.vy;



        // wrap around screen

        if(node.x < 0)
            node.x = width;


        if(node.x > width)
            node.x = 0;


        if(node.y < 0)
            node.y = height;


        if(node.y > height)
            node.y = 0;




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

    // ==========================
    // Draw Pulses
    // ==========================


    pulses.forEach((pulse,index)=>{


        pulse.progress += pulse.speed;



        const x =
        pulse.from.x +
        (pulse.to.x - pulse.from.x)
        * pulse.progress;



        const y =
        pulse.from.y +
        (pulse.to.y - pulse.from.y)
        * pulse.progress;



        // Heartbeat pulse

        const waveHeight = 12;
        const waveWidth = 35;


        ctx.beginPath();


        for(let i = -waveWidth; i <= waveWidth; i++){


            const offset =
            i / waveWidth;


            let wave = 0;


            if(offset > -0.25 && offset < -0.1){

                wave =
                Math.sin(
                    (offset + .25) * Math.PI * 4
                )
                * waveHeight;

            }


            if(offset >= -0.1 && offset <= .1){

                wave =
                -Math.sin(
                    (offset + .1) * Math.PI * 10
                )
                * waveHeight;

            }


            if(offset > .1 && offset < .25){

                wave =
                Math.sin(
                    (offset - .1) * Math.PI * 4
                )
                * waveHeight;

            }



            const px =
            x + i;


            const py =
            y + wave;



            if(i === -waveWidth){

                ctx.moveTo(px,py);

            }
            else{

                ctx.lineTo(px,py);

            }


        }



        ctx.strokeStyle =
        "rgba(34,197,94,1)";


        ctx.lineWidth = 2;


        ctx.shadowBlur = 20;

        ctx.shadowColor =
        "rgba(34,197,94,.8)";


        ctx.stroke();


        ctx.shadowBlur = 0;



    requestAnimationFrame(animate);


}



animate();

setInterval(()=>{

    createPulse();

},1500);