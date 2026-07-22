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



for(let i = 0; i < nodeCount; i++){

    nodes.push({

        x: Math.random()*width,
        y: Math.random()*height,

        radius: Math.random()*2+1,

        vx:(Math.random()-.5)*.15,
        vy:(Math.random()-.5)*.15

    });

}



// ==========================
// Create Permanent Connections
// ==========================

function createConnections(){

    connections.length = 0;


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


    if(connections.length===0)
        return;



    const connection =
    connections[
        Math.floor(
            Math.random()*connections.length
        )
    ];



    if(connection.pulse===null){

        connection.pulse=0;

    }

}



setInterval(()=>{

    startPulse();

},2000);



// ==========================
// Draw Connection
// ==========================

function drawConnection(connection){


    const a = connection.from;
    const b = connection.to;


    const dx = b.x-a.x;
    const dy = b.y-a.y;


    const distance =
    Math.hypot(dx,dy);


    const angle =
    Math.atan2(dy,dx);



    const opacity =
    1-distance/180;



    ctx.save();


    ctx.translate(
        a.x,
        a.y
    );


    ctx.rotate(angle);



    ctx.beginPath();



    // ----------------------
    // No pulse
    // ----------------------

    if(connection.pulse===null){


        ctx.moveTo(
            0,
            0
        );


        ctx.lineTo(
            distance,
            0
        );


    }


    // ----------------------
    // Heartbeat pulse
    // ----------------------

    else{


        const p =
        connection.pulse;


        const pulseX =
        distance*p;



        const spikeSize = 12;



        ctx.moveTo(
            0,
            0
        );


        ctx.lineTo(
            pulseX-25,
            0
        );


        // heartbeat goes UP

        ctx.lineTo(
            pulseX,
            -spikeSize
        );


        // heartbeat goes DOWN

        ctx.lineTo(
            pulseX+12,
            0
        );


        ctx.lineTo(
            distance,
            0
        );


    }



    ctx.strokeStyle =
    `rgba(34,197,94,${opacity*.25})`;


    ctx.lineWidth=1;


    ctx.stroke();



    ctx.restore();



    if(connection.pulse!==null){


        connection.pulse += .008;


        if(connection.pulse>=1){

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



    // move nodes

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


        ctx.fillStyle =
        "rgba(34,197,94,.8)";


        ctx.fill();


    });



    requestAnimationFrame(animate);

}


animate();