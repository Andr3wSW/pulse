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
const connections = [];

const nodeCount = 45;



for(let i=0;i<nodeCount;i++){

    nodes.push({

        x:Math.random()*width,
        y:Math.random()*height,

        radius:Math.random()*2+1,

        vx:(Math.random()-.5)*.15,
        vy:(Math.random()-.5)*.15

    });

}



// ==========================
// Connections
// ==========================


function createConnections(){

    connections.length=0;


    for(let i=0;i<nodes.length;i++){

        for(let j=i+1;j<nodes.length;j++){


            const distance =
            Math.hypot(
                nodes[i].x-nodes[j].x,
                nodes[i].y-nodes[j].y
            );


            if(distance < 180){

                connections.push({

                    from:nodes[i],

                    to:nodes[j],

                    pulse:null

                });

            }

        }

    }

}


createConnections();



// ==========================
// Start Pulse
// ==========================


function startPulse(){

    const available =
    connections.filter(
        c=>c.pulse===null
    );


    if(available.length===0)
        return;



    const connection =
    available[
        Math.floor(
            Math.random()*available.length
        )
    ];



    connection.pulse=0;

}



setInterval(()=>{

    startPulse();

},1800);




// ==========================
// Draw Connection
// ==========================


function drawConnection(connection){


    const a = connection.from;
    const b = connection.to;


    const dx=b.x-a.x;
    const dy=b.y-a.y;


    const distance =
    Math.hypot(dx,dy);



    const angle =
    Math.atan2(dy,dx);



    const opacity =
    1-(distance/180);



    const ecgWidth = 70;



    ctx.save();



    ctx.translate(
        a.x,
        a.y
    );


    ctx.rotate(angle);



    ctx.beginPath();



    // Normal line

    if(connection.pulse===null){


        ctx.moveTo(0,0);

        ctx.lineTo(
            distance,
            0
        );


    }



    // ECG pulse

    else{


        const travelDistance =
        distance - (ecgWidth * 2);


        const pulsePosition =
        (ecgWidth + travelDistance * connection.pulse);


        ctx.moveTo(
            0,
            0
        );



        // line before pulse

        ctx.lineTo(
            pulsePosition-35,
            0
        );



        // ECG dip

        ctx.lineTo(
            pulsePosition-20,
            4
        );



        // ECG spike up

        ctx.lineTo(
            pulsePosition-5,
            -18
        );



        // ECG spike down

        ctx.lineTo(
            pulsePosition+8,
            15
        );



        // recovery

        ctx.lineTo(
            pulsePosition+25,
            0
        );



        // line after pulse

        ctx.lineTo(
            distance,
            0
        );


    }



    if(connection.pulse!==null){

        ctx.strokeStyle =
        `rgba(34,197,94,${opacity*.9})`;

        ctx.shadowBlur=15;

        ctx.shadowColor=
        "rgba(34,197,94,.8)";

    }

    else{


        ctx.strokeStyle =
        `rgba(34,197,94,${opacity*.25})`;

    }



    ctx.lineWidth=1;

    ctx.stroke();



    ctx.restore();



    ctx.shadowBlur=0;



    if(connection.pulse!==null){


        connection.pulse += .004;



        if(connection.pulse>1){

            connection.pulse=null;

        }

    }


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


        node.x+=node.vx;
        node.y+=node.vy;


        if(node.x<0)
            node.x=width;

        if(node.x>width)
            node.x=0;

        if(node.y<0)
            node.y=height;

        if(node.y>height)
            node.y=0;


    });



    connections.forEach(connection=>{

        drawConnection(connection);

    });



    nodes.forEach(node=>{


        ctx.beginPath();


        ctx.arc(
            node.x,
            node.y,
            node.radius,
            0,
            Math.PI*2
        );


        ctx.fillStyle=
        "rgba(34,197,94,.8)";


        ctx.fill();


    });



    requestAnimationFrame(animate);

}



animate();